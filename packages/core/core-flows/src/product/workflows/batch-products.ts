import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreateProductWorkflowInputDTO,
  ProductTypes,
  UpdateProductWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createProductsWorkflow } from "./create-products"
import { deleteProductsWorkflow } from "./delete-products"
import { updateProductsWorkflow } from "./update-products"

export const batchProductsWorkflowId = "batch-products"
/**
 * This workflow creates, updates, or deletes products.
 */
export const batchProductsWorkflow = createWorkflow(
  batchProductsWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<
        CreateProductWorkflowInputDTO,
        UpdateProductWorkflowInputDTO
      >
    >
  ): WorkflowResponse<BatchWorkflowOutput<ProductTypes.ProductDTO>> => {
    const res = parallelize(
      createProductsWorkflow.runAsStep({
        input: { products: input.create ?? [] },
      }),
      updateProductsWorkflow.runAsStep({
        input: { products: input.update ?? [] },
      }),
      deleteProductsWorkflow.runAsStep({
        input: { ids: input.delete ?? [] },
      })
    )

    return new WorkflowResponse(
      transform({ res, input }, (data) => {
        return {
          created: data.res[0],
          updated: data.res[1],
          deleted: data.input.delete ?? [],
        }
      })
    )
  }
)
