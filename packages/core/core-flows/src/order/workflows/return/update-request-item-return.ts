import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  OrderChangeStatus,
  isDefined,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { validateReturnReasons } from "../../utils/validate-return-reason"

/**
 * This step validates that an item in a return can be updated.
 */
export const updateRequestItemReturnValidationStep = createStep(
  "update-request-item-return-validation",
  async function (
    {
      order,
      orderChange,
      orderReturn,
      input,
    }: {
      order: OrderDTO
      orderReturn: ReturnDTO
      orderChange: OrderChangeDTO
      input: OrderWorkflow.UpdateRequestItemReturnWorkflowInput
    },
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request return found for return ${input.return_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.RETURN_ITEM) {
      throw new Error(
        `Action ${associatedAction.id} is not requesting item return`
      )
    }

    if (input.data.reason_id) {
      await validateReturnReasons(
        {
          orderId: order.id,
          inputItems: [{ reason_id: input.data.reason_id }],
        },
        context
      )
    }
  }
)

export const updateRequestItemReturnWorkflowId = "update-request-item-return"
/**
 * This workflow updates an item in a return.
 */
export const updateRequestItemReturnWorkflow = createWorkflow(
  updateRequestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateRequestItemReturnWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          claim_id: input.claim_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    updateRequestItemReturnValidationStep({
      order,
      input,
      orderReturn,
      orderChange,
    })

    const updateData = transform(
      { orderChange, input },
      ({ input, orderChange }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data
        return {
          id: input.action_id,
          details: {
            quantity: data.quantity ?? originalAction.details?.quantity,
            reason_id: isDefined(data.reason_id)
              ? data.reason_id
              : originalAction.details?.reason_id,
          },
          internal_note: data.internal_note,
        }
      }
    )

    updateOrderChangeActionsStep([updateData])

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
