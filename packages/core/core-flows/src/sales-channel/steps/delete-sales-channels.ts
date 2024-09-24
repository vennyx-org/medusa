import { ISalesChannelModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteSalesChannelsStepId = "delete-sales-channels"
/**
 * This step deletes one or more sales channels.
 */
export const deleteSalesChannelsStep = createStep(
  deleteSalesChannelsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.softDeleteSalesChannels(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevSalesChannelIds, { container }) => {
    if (!prevSalesChannelIds?.length) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.restoreSalesChannels(prevSalesChannelIds)
  }
)
