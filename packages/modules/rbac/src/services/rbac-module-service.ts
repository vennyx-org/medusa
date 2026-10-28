import {
  Context,
  FilterableRbacRoleProps,
  FindConfig,
  RbacRoleDTO,
} from "@medusajs/framework/types"
import {
  InjectManager,
  MedusaContext,
  MedusaService,
  Policy,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  CreateRbacRoleParentDTO,
  IRbacModuleService,
  RbacRoleParentDTO,
  UpdateRbacRoleParentDTO,
} from "@medusajs/types"
import { RbacPolicy, RbacRole, RbacRoleParent, RbacRolePolicy } from "@models"
import { RbacRepository } from "../repositories"

type InjectedDependencies = {
  rbacRepository: RbacRepository
}

export default class RbacModuleService
  extends MedusaService({
    RbacRole,
    RbacPolicy,
    RbacRoleParent,
    RbacRolePolicy,
  })
  implements IRbacModuleService
{
  protected readonly rbacRepository_: RbacRepository

  constructor({ rbacRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.rbacRepository_ = rbacRepository
  }

  __hooks = {
    onApplicationStart: async () => {
      this.onApplicationStart()
    },
  }

  async onApplicationStart(): Promise<void> {
    await this.syncRegisteredPolicies()
  }

  @InjectManager()
  private async syncRegisteredPolicies(
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const registeredPolicies = Object.entries(Policy).map(
      ([name, { resource, operation, description }]) => ({
        key: `${resource}:${operation}`,
        name,
        resource,
        operation,
        description,
      })
    )

    const registeredKeys = registeredPolicies.map((p) => p.key)

    // Fetch all existing policies (including soft-deleted ones)
    const existingPolicies = await this.listRbacPolicies(
      {},
      { withDeleted: true },
      sharedContext
    )

    const existingPoliciesMap = new Map(existingPolicies.map((p) => [p.key, p]))

    const policiesToCreate: any[] = []
    const policiesToUpdate: any[] = []
    const policiesToRestore: string[] = []

    // Process registered policies
    for (const registeredPolicy of registeredPolicies) {
      const existing = existingPoliciesMap.get(registeredPolicy.key)

      const hasChanges =
        existing &&
        (existing.name !== registeredPolicy.name ||
          existing.description !== registeredPolicy.description)

      if (!existing) {
        policiesToCreate.push(registeredPolicy)
      } else if (existing.deleted_at) {
        policiesToRestore.push(existing.id)
        if (hasChanges) {
          policiesToUpdate.push({
            id: existing.id,
            name: registeredPolicy.name,
            description: registeredPolicy.description,
          })
        }
      } else if (hasChanges) {
        policiesToUpdate.push({
          id: existing.id,
          name: registeredPolicy.name,
          description: registeredPolicy.description,
        })
      }
    }

    const policiesToSoftDelete = existingPolicies
      .filter((p) => !p.deleted_at && !registeredKeys.includes(p.key))
      .map((p) => p.id)

    // First restore any soft-deleted policies
    if (policiesToRestore.length > 0) {
      await this.restoreRbacPolicies(policiesToRestore, {}, sharedContext)
    }

    await promiseAll([
      policiesToCreate.length > 0 &&
        this.createRbacPolicies(policiesToCreate, sharedContext),
      policiesToUpdate.length > 0 &&
        this.updateRbacPolicies(policiesToUpdate, sharedContext),
      policiesToSoftDelete.length > 0 &&
        this.softDeleteRbacPolicies(policiesToSoftDelete, {}, sharedContext),
    ])
  }

  @InjectManager()
  async listPoliciesForRole(
    roleId: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any[]> {
    return await this.rbacRepository_.listPoliciesForRole(roleId, sharedContext)
  }

  @InjectManager()
  // @ts-expect-error
  async listRbacRoles(
    filters: FilterableRbacRoleProps = {},
    config: FindConfig<RbacRoleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RbacRoleDTO[]> {
    const roles = await super.listRbacRoles(
      filters,
      config as any,
      sharedContext
    )

    const shouldIncludePolicies =
      config.relations?.includes("policies") ||
      config.select?.includes("policies")

    if (shouldIncludePolicies && roles.length > 0) {
      const roleIds = roles.map((role) => role.id)
      const policiesByRole = await this.rbacRepository_.listPoliciesForRoles(
        roleIds,
        sharedContext
      )

      for (const role of roles) {
        role.policies = policiesByRole.get(role.id) || []
      }
    }

    return roles as unknown as RbacRoleDTO[]
  }

  @InjectManager()
  // @ts-expect-error
  async listAndCountRbacRoles(
    filters: FilterableRbacRoleProps = {},
    config: FindConfig<RbacRoleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[RbacRoleDTO[], number]> {
    const [roles, count] = await super.listAndCountRbacRoles(
      filters,
      config as any,
      sharedContext
    )

    const shouldIncludePolicies =
      config.relations?.includes("policies") ||
      config.select?.includes("policies")

    if (shouldIncludePolicies && roles.length > 0) {
      const roleIds = roles.map((role) => role.id)
      const policiesByRole = await this.rbacRepository_.listPoliciesForRoles(
        roleIds,
        sharedContext
      )

      for (const role of roles) {
        role.policies = policiesByRole.get(role.id) || []
      }
    }

    return [roles as unknown as RbacRoleDTO[], count]
  }

  @InjectManager()
  // @ts-expect-error
  async createRbacRoleParents(
    data: CreateRbacRoleParentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RbacRoleParentDTO[]> {
    for (const parent of data) {
      const { role_id, parent_id } = parent

      if (role_id === parent_id) {
        throw new Error(
          `Cannot create role parent relationship: a role cannot be its own parent (role_id: ${role_id})`
        )
      }

      const wouldCreateCycle = await this.rbacRepository_.checkForCycle(
        role_id,
        parent_id,
        sharedContext
      )

      if (wouldCreateCycle) {
        throw new Error(
          `Cannot create role parent relationship: this would create a circular dependency (role_id: ${role_id}, parent_id: ${parent_id})`
        )
      }
    }

    return await super.createRbacRoleParents(data, sharedContext)
  }

  @InjectManager()
  // @ts-expect-error
  async updateRbacRoleParents(
    data: UpdateRbacRoleParentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RbacRoleParentDTO[]> {
    for (const parent of data) {
      const { role_id, parent_id } = parent

      if (parent_id) {
        if (role_id === parent_id) {
          throw new Error(
            `Cannot update role parent relationship: a role cannot be its own parent (role_id: ${role_id})`
          )
        }

        const wouldCreateCycle = await this.rbacRepository_.checkForCycle(
          role_id!,
          parent_id,
          sharedContext
        )

        if (wouldCreateCycle) {
          throw new Error(
            `Cannot update role parent relationship: this would create a circular dependency (role_id: ${role_id}, parent_id: ${parent_id})`
          )
        }
      }
    }

    return await super.updateRbacRoleParents(data, sharedContext)
  }
}
