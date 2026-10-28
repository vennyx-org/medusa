import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

export type DeleteRbacRolePoliciesStepInput = string[]

export const deleteRbacRolePoliciesStepId = "delete-rbac-role-policies"

export const deleteRbacRolePoliciesStep = createStep(
  { name: deleteRbacRolePoliciesStepId, noCompensation: true },
  async (ids: DeleteRbacRolePoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    const deleted = await service.deleteRbacRolePolicies(ids)

    return new StepResponse(deleted, ids)
  },
  async (deletedRolePolicyIds, { container }) => {
    if (!deletedRolePolicyIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.restoreRbacRolePolicies(deletedRolePolicyIds)
  }
)
