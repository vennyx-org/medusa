import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CreateTranslationDTO, UpdateTranslationDTO } from "@medusajs/types"
import { createTranslationsWorkflow } from "./create-translations"
import { deleteTranslationsWorkflow } from "./delete-translations"
import { updateTranslationsWorkflow } from "./update-translations"

export const batchTranslationsWorkflowId = "batch-translations"

export type BatchTranslationsWorkflowInput = {
  create: CreateTranslationDTO[]
  update: UpdateTranslationDTO[]
  delete: string[]
}
export const batchTranslationsWorkflow = createWorkflow(
  batchTranslationsWorkflowId,
  (input: BatchTranslationsWorkflowInput) => {
    const [created, updated, deleted] = parallelize(
      createTranslationsWorkflow.runAsStep({
        input: {
          translations: input.create,
        },
      }),
      updateTranslationsWorkflow.runAsStep({
        input: {
          translations: input.update,
        },
      }),
      deleteTranslationsWorkflow.runAsStep({
        input: {
          ids: input.delete,
        },
      })
    )

    return new WorkflowResponse(
      transform({ created, updated, deleted }, (result) => result)
    )
  }
)
