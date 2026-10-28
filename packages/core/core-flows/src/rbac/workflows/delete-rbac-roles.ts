import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacRolesStep } from "../steps"

export type DeleteRbacRolesWorkflowInput = {
  ids: string[]
}

export const deleteRbacRolesWorkflowId = "delete-rbac-roles"

export const deleteRbacRolesWorkflow = createWorkflow(
  deleteRbacRolesWorkflowId,
  (input: WorkflowData<DeleteRbacRolesWorkflowInput>): WorkflowData<void> => {
    deleteRbacRolesStep(input.ids)
  }
)
