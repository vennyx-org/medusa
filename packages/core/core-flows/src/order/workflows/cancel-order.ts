import {
  FulfillmentDTO,
  OrderDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
} from "@medusajs/framework/types"
import { MedusaError, deepFlatMap } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { cancelPaymentStep } from "../../payment/steps"
import { deleteReservationsByLineItemsStep } from "../../reservation/steps"
import { cancelOrdersStep } from "../steps/cancel-orders"
import { throwIfOrderIsCancelled } from "../utils/order-validation"

/**
 * This step validates that an order can be canceled.
 */
export const cancelValidateOrder = createStep(
  "cancel-validate-order",
  ({
    order,
  }: {
    order: OrderDTO
    input: OrderWorkflow.CancelOrderWorkflowInput
  }) => {
    const order_ = order as OrderDTO & {
      payment_collections: PaymentCollectionDTO[]
      fulfillments: FulfillmentDTO[]
    }

    throwIfOrderIsCancelled({ order })

    let refunds = 0
    let captures = 0

    deepFlatMap(order_, "payment_collections.payments", ({ payments }) => {
      refunds += payments?.refunds?.length ?? 0
      captures += payments?.captures?.length ?? 0
    })

    if (captures > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order with payment capture(s) cannot be canceled"
      )
    }

    if (refunds > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order with payment refund(s) cannot be canceled"
      )
    }

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      type: string
    ) => {
      if (arr?.some(pred)) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `All ${type} must be canceled before canceling an order`
        )
      }
    }

    const notCanceled = (o) => !o.canceled_at

    throwErrorIf(order_.fulfillments, notCanceled, "fulfillments")
  }
)

export const cancelOrderWorkflowId = "cancel-order"
/**
 * This workflow cancels an order.
 */
export const cancelOrderWorkflow = createWorkflow(
  cancelOrderWorkflowId,
  (input: WorkflowData<OrderWorkflow.CancelOrderWorkflowInput>) => {
    const order: OrderDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "orders",
        fields: [
          "id",
          "status",
          "items.id",
          "fulfillments.canceled_at",
          "payment_collections.payments.id",
          "payment_collections.payments.refunds.id",
          "payment_collections.payments.captures.id",
        ],
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      })

    cancelValidateOrder({ order, input })

    const lineItemIds = transform({ order }, ({ order }) => {
      return order.items?.map((i) => i.id)
    })

    const paymentIds = transform({ order }, ({ order }) => {
      return deepFlatMap(
        order,
        "payment_collections.payments",
        ({ payments }) => {
          return payments?.id
        }
      )
    })

    parallelize(
      deleteReservationsByLineItemsStep(lineItemIds),
      cancelPaymentStep({ paymentIds }),
      cancelOrdersStep({ orderIds: [order.id] })
    )

    const orderCanceled = createHook("orderCanceled", {
      order,
    })

    return new WorkflowResponse(void 0, {
      hooks: [orderCanceled],
    })
  }
)
