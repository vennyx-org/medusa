import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { UpdateRbacPolicyDTO } from "@medusajs/types"
import { updateRbacPoliciesStep } from "../steps/update-rbac-policies"

export type UpdateRbacPoliciesWorkflowInput = {
  selector: Record<string, any>
  update: Omit<UpdateRbacPolicyDTO, "id">
}

export const updateRbacPoliciesWorkflowId = "update-rbac-policies"

export const updateRbacPoliciesWorkflow = createWorkflow(
  updateRbacPoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacPoliciesStep(input))
  }
)
