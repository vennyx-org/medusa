import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

export type CreateRbacRoleParentDTO = {
  role_id: string
  parent_id: string
  metadata?: Record<string, unknown> | null
}

export type CreateRbacRoleParentsStepInput = {
  role_parents: CreateRbacRoleParentDTO[]
}

export const createRbacRoleParentsStepId = "create-rbac-role-parents"

export const createRbacRoleParentsStep = createStep(
  createRbacRoleParentsStepId,
  async (data: CreateRbacRoleParentsStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!data.role_parents?.length) {
      return new StepResponse([], [])
    }

    const created = await service.createRbacRoleParents(data.role_parents)

    return new StepResponse(
      created,
      (created ?? []).map((ri) => ri.id)
    )
  },
  async (createdIds: string[] | undefined, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.deleteRbacRoleParents(createdIds)
  }
)
