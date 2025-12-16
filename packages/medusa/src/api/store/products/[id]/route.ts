import { MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  applyTranslations,
  isPresent,
  MedusaError,
  QueryContext,
} from "@medusajs/framework/utils"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "../../../utils/middlewares"
import {
  filterOutInternalProductCategories,
  refetchProduct,
  RequestWithContext,
  wrapProductsWithTaxPrices,
} from "../helpers"

export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductParams>,
  res: MedusaResponse<HttpTypes.StoreProductResponse>
) => {
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  const filters: object = {
    id: req.params.id,
    ...req.filterableFields,
  }

  if (isPresent(req.pricingContext)) {
    filters["context"] ??= {}
    filters["context"]["variants"] ??= {}
    filters["context"]["variants"]["calculated_price"] ??= QueryContext(
      req.pricingContext!
    )
  }

  const includesCategoriesField = req.queryConfig.fields.some((field) =>
    field.startsWith("categories")
  )

  if (!req.queryConfig.fields.includes("categories.is_internal")) {
    req.queryConfig.fields.push("categories.is_internal")
  }

  const product = await refetchProduct(
    filters,
    req.scope,
    req.queryConfig.fields
  )

  if (!product) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with id: ${req.params.id} was not found`
    )
  }

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      product.variants || []
    )
  }

  if (includesCategoriesField) {
    filterOutInternalProductCategories([product])
  }

  await wrapProductsWithTaxPrices(req, [product])
  await applyTranslations({
    localeCode: req.locale,
    objects: [product],
    container: req.scope,
  })
  res.json({ product })
}
