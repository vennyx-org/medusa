import { IPromotionModuleService, UsageComputedActions } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const registerUsageStepId = "register-usage"
/**
 * This step registers usage for promotion campaigns
 */
export const registerUsageStep = createStep(
  registerUsageStepId,
  async (data: UsageComputedActions[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const revertData = await promotionModule.registerUsage(data)

    return new StepResponse(null, revertData)
  },
  async (revertData, { container }) => {
    // TODO: Figure out how this action can be reverted
  }
)
