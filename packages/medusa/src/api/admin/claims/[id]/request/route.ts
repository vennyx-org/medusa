import {
  cancelBeginOrderClaimWorkflow,
  confirmClaimRequestWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { defaultAdminDetailsReturnFields } from "../../../returns/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminClaimRequestResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await confirmClaimRequestWorkflow(req.scope).run({
    input: {
      claim_id: id,
      confirmed_by: req.auth_context.actor_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_claim",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderClaim] = await remoteQuery(queryObject, {
    throwIfKeyNotFound: true,
  })

  let orderReturn
  if (orderClaim.return_id) {
    const [orderReturnData] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "return",
        variables: {
          id: orderClaim.return_id,
        },
        fields: defaultAdminDetailsReturnFields,
      })
    )
    orderReturn = orderReturnData
  }

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    claim: orderClaim,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminClaimDeleteResponse>
) => {
  const { id } = req.params

  await cancelBeginOrderClaimWorkflow(req.scope).run({
    input: {
      claim_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "claim",
    deleted: true,
  })
}
