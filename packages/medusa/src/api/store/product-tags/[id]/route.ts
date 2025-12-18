import { StoreProductTagResponse } from "@medusajs/framework/types"
import {
  applyTranslations,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { StoreProductTagParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductTagParamsType>,
  res: MedusaResponse<StoreProductTagResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product_tag",
    filters: {
      id: req.params.id,
    },
    fields: req.queryConfig.fields,
  })

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product tag with id: ${req.params.id} was not found`
    )
  }

  const productTag = data[0]

  await applyTranslations({
    localeCode: req.locale,
    objects: [productTag],
    container: req.scope,
  })

  res.json({ product_tag: productTag })
}
