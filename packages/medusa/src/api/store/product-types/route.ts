import { HttpTypes } from "@medusajs/framework/types"
import {
  applyTranslations,
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.StoreProductTypeListParams>,
  res: MedusaResponse<HttpTypes.StoreProductTypeListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: product_types, metadata } = await query.graph({
    entity: "product_type",
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
    fields: req.queryConfig.fields,
  })

  await applyTranslations({
    localeCode: req.locale,
    objects: product_types,
    container: req.scope,
  })

  res.json({
    product_types,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}
