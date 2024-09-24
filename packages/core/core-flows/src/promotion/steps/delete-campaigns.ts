import { IPromotionModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteCampaignsStepId = "delete-campaigns"
/**
 * This step deletes one or more campaigns.
 */
export const deleteCampaignsStep = createStep(
  deleteCampaignsStepId,
  async (ids: string[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.softDeleteCampaigns(ids)

    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.restoreCampaigns(idsToRestore)
  }
)
