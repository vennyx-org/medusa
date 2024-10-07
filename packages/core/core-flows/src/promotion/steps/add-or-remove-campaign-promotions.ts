import {
  IPromotionModuleService,
  LinkWorkflowInput,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowData,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export const addOrRemoveCampaignPromotionsStepId =
  "add-or-remove-campaign-promotions"
/**
 * This step adds or removes promotions from a campaign.
 */
export const addOrRemoveCampaignPromotionsStep = createStep(
  addOrRemoveCampaignPromotionsStepId,
  async (input: WorkflowData<LinkWorkflowInput>, { container }) => {
    const {
      id: campaignId,
      add: promotionIdsToAdd = [],
      remove: promotionIdsToRemove = [],
    } = input
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    if (promotionIdsToAdd.length) {
      await promotionModule.addPromotionsToCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToAdd,
      })
    }

    if (promotionIdsToRemove.length) {
      await promotionModule.removePromotionsFromCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToRemove,
      })
    }

    return new StepResponse(null, input)
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const {
      id: campaignId,
      add: promotionIdsToRemove = [],
      remove: promotionIdsToAdd = [],
    } = data

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    if (promotionIdsToAdd.length) {
      promotionModule.addPromotionsToCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToAdd,
      })
    }

    if (promotionIdsToRemove.length) {
      promotionModule.removePromotionsFromCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToRemove,
      })
    }
  }
)
