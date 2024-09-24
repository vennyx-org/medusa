import { IOrderModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteExchangesStepId = "delete-exchanges"
/**
 * This step deletes one or more exchanges.
 */
export const deleteExchangesStep = createStep(
  deleteExchangesStepId,
  async (data: { ids: string[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const deleted = await service.softDeleteOrderExchanges(data.ids)

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreOrderExchanges(ids)
  }
)
