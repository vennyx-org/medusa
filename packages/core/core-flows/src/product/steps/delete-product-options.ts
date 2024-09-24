import { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteProductOptionsStepId = "delete-product-options"
/**
 * This step deletes one or more product options.
 */
export const deleteProductOptionsStep = createStep(
  deleteProductOptionsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.softDeleteProductOptions(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.restoreProductOptions(prevIds)
  }
)
