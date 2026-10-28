import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteRbacRolePoliciesStep } from "../steps"

export type DeleteRbacRolePoliciesWorkflowInput = {
  role_policy_ids: string[]
}

export const deleteRbacRolePoliciesWorkflowId = "delete-rbac-role-policies"

export const deleteRbacRolePoliciesWorkflow = createWorkflow(
  deleteRbacRolePoliciesWorkflowId,
  (input: WorkflowData<DeleteRbacRolePoliciesWorkflowInput>) => {
    const deletedRolePolicies = deleteRbacRolePoliciesStep(
      input.role_policy_ids
    )

    return new WorkflowResponse(deletedRolePolicies)
  }
)
