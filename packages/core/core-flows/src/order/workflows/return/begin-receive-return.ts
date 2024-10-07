import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"

/**
 * This step validates that a return can be received.
 */
export const beginReceiveReturnValidationStep = createStep(
  "begin-receive-return-validation",
  async function (
    {
      orderReturn,
      order,
    }: {
      orderReturn: ReturnDTO
      order: OrderDTO
    },
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
  }
)

export const beginReceiveReturnWorkflowId = "begin-receive-return"
/**
 * This workflow requests return receival.
 */
export const beginReceiveReturnWorkflow = createWorkflow(
  beginReceiveReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginReceiveOrderReturnWorkflowInput>
  ): WorkflowResponse<OrderChangeDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "status", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    beginReceiveReturnValidationStep({ order, orderReturn })

    const orderChangeInput = transform(
      { orderReturn, order, input },
      ({ orderReturn, order, input }) => {
        return {
          change_type: "return_receive" as const,
          order_id: order.id,
          return_id: orderReturn.id,
          created_by: input.created_by,
          description: input.description,
          internal_note: input.internal_note,
        }
      }
    )
    return new WorkflowResponse(createOrderChangeStep(orderChangeInput))
  }
)
