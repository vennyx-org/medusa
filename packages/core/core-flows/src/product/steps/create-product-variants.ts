import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createProductVariantsStepId = "create-product-variants"
/**
 * This step creates one or more product variants.
 */
export const createProductVariantsStep = createStep(
  createProductVariantsStepId,
  async (data: ProductTypes.CreateProductVariantDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)
    const created = await service.createProductVariants(data)
    return new StepResponse(
      created,
      created.map((productVariant) => productVariant.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.deleteProductVariants(createdIds)
  }
)
