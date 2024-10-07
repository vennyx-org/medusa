import { createProductsWorkflow } from "@medusajs/core-flows"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchEntities, refetchEntity } from "../../utils/refetch-entity"
import { remapKeysForProduct, remapProductResponse } from "./helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductListParams>,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) => {
  const selectFields = remapKeysForProduct(req.remoteQueryConfig.fields ?? [])

  const { rows: products, metadata } = await refetchEntities(
    "product",
    req.filterableFields,
    req.scope,
    selectFields,
    req.remoteQueryConfig.pagination
  )

  res.json({
    products: products.map(remapProductResponse),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateProduct & AdditionalData
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const { additional_data, ...products } = req.validatedBody

  const { result } = await createProductsWorkflow(req.scope).run({
    input: { products: [products], additional_data },
  })

  const product = await refetchEntity(
    "product",
    result[0].id,
    req.scope,
    remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  )

  res.status(200).json({ product: remapProductResponse(product) })
}
