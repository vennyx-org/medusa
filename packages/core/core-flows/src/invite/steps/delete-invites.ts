import { IUserModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteInvitesStepId = "delete-invites-step"
/**
 * This step deletes one or more invites.
 */
export const deleteInvitesStep = createStep(
  deleteInvitesStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(Modules.USER)

    await service.softDeleteInvites(input)

    return new StepResponse(void 0, input)
  },
  async (deletedInviteIds, { container }) => {
    if (!deletedInviteIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(Modules.USER)

    await service.restoreInvites(deletedInviteIds)
  }
)
