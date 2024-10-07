import { OrderWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"

import { ReturnDTO } from "@medusajs/framework/types"
import { receiveReturnStep } from "../../steps/return/receive-return"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInReturn,
} from "../../utils/order-validation"

/**
 * This step validates that a return can be received and completed.
 */
export const receiveCompleteReturnValidationStep = createStep(
  "receive-return-order-validation",
  async function (
    {
      orderReturn,
      input,
    }: {
      orderReturn
      input: OrderWorkflow.ReceiveCompleteOrderReturnWorkflowInput
    },
    context
  ) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfItemsDoesNotExistsInReturn({ orderReturn, inputItems: input.items })
  }
)

export const receiveAndCompleteReturnOrderWorkflowId = "receive-return-order"
/**
 * This workflow marks a return as received and completes it.
 */
export const receiveAndCompleteReturnOrderWorkflow = createWorkflow(
  receiveAndCompleteReturnOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.ReceiveCompleteOrderReturnWorkflowInput>
  ): WorkflowResponse<ReturnDTO | undefined> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "returns",
      fields: ["id", "canceled_at", "items.*"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    receiveCompleteReturnValidationStep({ orderReturn, input })

    return new WorkflowResponse(receiveReturnStep(input))
  }
)
