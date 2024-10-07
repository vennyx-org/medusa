import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { deleteInventoryItemStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { Modules } from "@medusajs/framework/utils"

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
/**
 * This workflow deletes one or more inventory items.
 */
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (input: WorkflowData<string[]>): WorkflowResponse<string[]> => {
    deleteInventoryItemStep(input)
    removeRemoteLinkStep({
      [Modules.INVENTORY]: { inventory_item_id: input },
    })
    return new WorkflowResponse(input)
  }
)
