import { IOrderModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const previewOrderChangeStepId = "preview-order-change"
/**
 * This step retrieves a preview of an order change.
 */
export const previewOrderChangeStep = createStep(
  previewOrderChangeStepId,
  async (orderId: string, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const preview = await service.previewOrderChange(orderId)

    return new StepResponse(preview)
  }
)
