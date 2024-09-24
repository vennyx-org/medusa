import {
  IOrderModuleService,
  UpdateOrderShippingMethodDTO,
} from "@medusajs/types"
import { Modules, getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateOrderShippingMethodsStepId = "update-order-shopping-methods"
/**
 * This step updates order shipping methods.
 */
export const updateOrderShippingMethodsStep = createStep(
  updateOrderShippingMethodsStepId,
  async (data: UpdateOrderShippingMethodDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listOrderShippingMethods(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateOrderShippingMethods(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderShippingMethods(dataBeforeUpdate)
  }
)
