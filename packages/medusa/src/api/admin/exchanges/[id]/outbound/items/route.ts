import { orderExchangeAddNewItemWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminPostExchangesAddItemsReqSchemaType } from "../../../validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostExchangesAddItemsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminExchangePreviewResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await orderExchangeAddNewItemWorkflow(req.scope).run({
    input: { ...req.validatedBody, exchange_id: id },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchange",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderExchange] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    exchange: orderExchange,
  })
}
