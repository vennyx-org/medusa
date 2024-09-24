import {
  IPricingModuleService,
  PriceDTO,
  UpdatePriceListPriceDTO,
  UpdatePriceListPricesDTO,
  UpdatePriceListPriceWorkflowDTO,
  UpdatePriceListPriceWorkflowStepDTO,
} from "@medusajs/types"
import { buildPriceSetPricesForModule, Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const updatePriceListPricesStepId = "update-price-list-prices"
/**
 * This step updates a price list's prices.
 */
export const updatePriceListPricesStep = createStep(
  updatePriceListPricesStepId,
  async (stepInput: UpdatePriceListPriceWorkflowStepDTO, { container }) => {
    const { data = [], variant_price_map: variantPriceSetMap } = stepInput
    const priceListPricesToUpdate: UpdatePriceListPricesDTO[] = []
    const priceIds: string[] = []
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    for (const priceListData of data) {
      const pricesToUpdate: UpdatePriceListPriceDTO[] = []
      const { prices = [], id } = priceListData

      for (const price of prices) {
        const toPush = {
          ...price,
          price_set_id: variantPriceSetMap[price.variant_id!],
        } as UpdatePriceListPriceDTO
        delete (toPush as Partial<UpdatePriceListPriceWorkflowDTO>).variant_id

        pricesToUpdate.push(toPush)

        if (price.id) {
          priceIds.push(price.id)
        }
      }

      priceListPricesToUpdate.push({
        price_list_id: id,
        prices: pricesToUpdate,
      })
    }

    const existingPrices = priceIds.length
      ? await pricingModule.listPrices(
          { id: priceIds },
          { relations: ["price_list"] }
        )
      : []

    const priceListPricesMap = new Map<string, PriceDTO[]>()
    const dataBeforePriceUpdate: UpdatePriceListPricesDTO[] = []

    for (const price of existingPrices) {
      const priceListId = price.price_list!.id
      const prices = priceListPricesMap.get(priceListId) || []

      priceListPricesMap.set(priceListId, prices)
    }

    for (const [priceListId, prices] of Object.entries(priceListPricesMap)) {
      dataBeforePriceUpdate.push({
        price_list_id: priceListId,
        prices: buildPriceSetPricesForModule(prices),
      })
    }

    const updatedPrices = await pricingModule.updatePriceListPrices(
      priceListPricesToUpdate
    )

    return new StepResponse(updatedPrices, dataBeforePriceUpdate)
  },
  async (dataBeforePriceUpdate, { container }) => {
    if (!dataBeforePriceUpdate?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    if (dataBeforePriceUpdate.length) {
      await pricingModule.updatePriceListPrices(dataBeforePriceUpdate)
    }
  }
)
