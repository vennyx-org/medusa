import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createRbacPoliciesStep } from "../steps"

export type CreateRbacPoliciesWorkflowInput = {
  policies: any[]
}

export const createRbacPoliciesWorkflowId = "create-rbac-policies"

export const createRbacPoliciesWorkflow = createWorkflow(
  createRbacPoliciesWorkflowId,
  (input: WorkflowData<CreateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(createRbacPoliciesStep(input))
  }
)
