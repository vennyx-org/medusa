import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacPoliciesStep } from "../steps"

export type DeleteRbacPoliciesWorkflowInput = {
  ids: string[]
}

export const deleteRbacPoliciesWorkflowId = "delete-rbac-policies"

export const deleteRbacPoliciesWorkflow = createWorkflow(
  deleteRbacPoliciesWorkflowId,
  (
    input: WorkflowData<DeleteRbacPoliciesWorkflowInput>
  ): WorkflowData<void> => {
    deleteRbacPoliciesStep(input.ids)
  }
)
