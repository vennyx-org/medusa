import { ITaxModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteTaxRatesStepId = "delete-tax-rates"
/**
 * This step deletes one or more tax rates.
 */
export const deleteTaxRatesStep = createStep(
  deleteTaxRatesStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.softDeleteTaxRates(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.restoreTaxRates(prevIds)
  }
)
