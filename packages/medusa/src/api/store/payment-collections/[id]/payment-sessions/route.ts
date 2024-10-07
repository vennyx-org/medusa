import { createPaymentSessionsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { StoreCreatePaymentSessionType } from "../../validators"
import { refetchPaymentCollection } from "../../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreatePaymentSessionType>,
  res: MedusaResponse<HttpTypes.StorePaymentCollectionResponse>
) => {
  const collectionId = req.params.id
  const { context = {}, data, provider_id } = req.body

  // If the customer is logged in, we auto-assign them to the payment collection
  if (req.auth_context?.actor_id) {
    ;(context as any).customer = {
      id: req.auth_context?.actor_id,
    }
  }
  const workflowInput = {
    payment_collection_id: collectionId,
    provider_id: provider_id,
    data,
    context,
  }

  await createPaymentSessionsWorkflow(req.scope).run({
    input: workflowInput,
  })

  const paymentCollection = await refetchPaymentCollection(
    collectionId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    payment_collection: paymentCollection as HttpTypes.StorePaymentCollection,
  })
}
