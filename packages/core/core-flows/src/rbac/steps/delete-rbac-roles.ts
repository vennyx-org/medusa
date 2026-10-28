import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

export type DeleteRbacRolesStepInput = string[]

export const deleteRbacRolesStepId = "delete-rbac-roles"

/**
 * This step deletes one or more RBAC roles.
 * @param ids - The IDs of the roles to delete
 * @param container - The workflow container
 * @returns A step response with the deleted role IDs
 */
export const deleteRbacRolesStep = createStep(
  deleteRbacRolesStepId,
  async (ids: DeleteRbacRolesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    const deleted = await service.deleteRbacRoles(ids)

    return new StepResponse(deleted, ids)
  },
  async (deletedRoleIds, { container }) => {
    if (!deletedRoleIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    // Restore the soft-deleted roles during compensation
    await service.restoreRbacRoles(deletedRoleIds)
  }
)
