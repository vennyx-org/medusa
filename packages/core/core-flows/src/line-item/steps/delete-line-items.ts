import { ICartModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteLineItemsStepId = "delete-line-items"
/**
 * This step deletes line items.
 */
export const deleteLineItemsStep = createStep(
  deleteLineItemsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

    await service.softDeleteLineItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }
    const service = container.resolve<ICartModuleService>(Modules.CART)

    await service.restoreLineItems(ids)
  }
)
