import {
  ContainerRegistrationKeys,
  MedusaError,
  toSnakeCase,
} from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

export type ValidateUserPermissionsStepInput = {
  actor_id: string
  actor?: string
  policy_ids?: string[]
  actions?: {
    resource: string
    operation: string
  }[]
}

export const validateUserPermissionsStepId = "validate-user-permissions"

/**
 * Validates that a user has access to all the policies they are trying to assign.
 * A user can only create roles and add policies that they themselves have access to.
 */
export const validateUserPermissionsStep = createStep(
  validateUserPermissionsStepId,
  async (data: ValidateUserPermissionsStepInput, { container }) => {
    const { actor_id, actor, policy_ids, actions } = data

    if (!policy_ids?.length && !actions?.length) {
      return
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: users } = await query.graph({
      entity: actor ?? "user",
      fields: ["rbac_roles.id", "rbac_roles.policies.*"],
      filters: { id: actor_id },
    })

    if (!users?.[0]?.rbac_roles || users[0].rbac_roles.length === 0) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        `User does not have any roles assigned and cannot create roles or assign policies`
      )
    }

    const operationMap = new Map()
    users[0].rbac_roles.forEach((role) => {
      role.policies.forEach((policy) => {
        const op =
          policy.operation === "*" ? "*" : toSnakeCase(policy.operation)
        operationMap.set(`${policy.resource}:${op}`, policy.id)
      })
    })

    const allUserPolicies = users[0].rbac_roles.flatMap(
      (role) => role.policies || []
    )
    const userPolicyIds = new Set(allUserPolicies.map((p) => p.id))

    let unauthorizedPolicies: string[] = []

    if (policy_ids?.length) {
      unauthorizedPolicies = policy_ids.filter(
        (policyId) => !userPolicyIds.has(policyId)
      )
    } else if (actions?.length) {
      unauthorizedPolicies = actions
        .filter((action) => {
          const op =
            action.operation === "*" ? "*" : toSnakeCase(action.operation)

          return (
            !operationMap.has(`${action.resource}:${op}`) &&
            !operationMap.has(`${action.resource}:*`)
          )
        })
        .map((action) => `${action.resource}:${action.operation}`)
    }

    if (unauthorizedPolicies.length) {
      const policyMap = new Map(
        allUserPolicies.map((p) => [p.id, p.name || p.key])
      )

      const unauthorizedNames = unauthorizedPolicies
        .map((id) => policyMap.get(id) || id)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        `User does not have access to the following policies and cannot assign them: ${unauthorizedNames}`
      )
    }
  }
)
