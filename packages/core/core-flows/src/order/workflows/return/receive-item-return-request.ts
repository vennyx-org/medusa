import {
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { previewOrderChangeStep } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInReturn,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"

/**
 * This step validates that a return's items can be marked as received.
 */
export const receiveItemReturnRequestValidationStep = createStep(
  "receive-item-return-request-validation",
  async function (
    {
      order,
      orderChange,
      orderReturn,
      items,
    }: {
      order: Pick<OrderDTO, "id" | "items">
      orderReturn: ReturnDTO
      orderChange: OrderChangeDTO
      items: OrderWorkflow.ReceiveOrderReturnItemsWorkflowInput["items"]
    },
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInReturn({ orderReturn, inputItems: items })
  }
)

export const receiveItemReturnRequestWorkflowId = "receive-item-return-request"
/**
 * This workflow marks return items as received.
 */
export const receiveItemReturnRequestWorkflow = createWorkflow(
  receiveItemReturnRequestWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.ReceiveOrderReturnItemsWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at", "items.*"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "order_id", "return_id"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    receiveItemReturnRequestValidationStep({
      order,
      items: input.items,
      orderReturn,
      orderChange,
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderReturn, items: input.items },
      ({ order, orderChange, orderReturn, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          return_id: orderReturn.id,
          version: orderChange.version,
          action: ChangeActionType.RECEIVE_RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            quantity: item.quantity,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
