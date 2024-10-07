import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { WorkflowTypes } from "@medusajs/framework/types"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"
import {
  waitConfirmationProductImportStep,
  groupProductsForBatchStep,
  parseProductCsvStep,
} from "../steps"
import { batchProductsWorkflow } from "./batch-products"

export const importProductsWorkflowId = "import-products"
/**
 * This workflow imports products from a CSV file.
 */
export const importProductsWorkflow = createWorkflow(
  importProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ImportProductsDTO>
  ): WorkflowResponse<WorkflowTypes.ProductWorkflow.ImportProductsSummary> => {
    const products = parseProductCsvStep(input.fileContent)
    const batchRequest = groupProductsForBatchStep(products)

    const summary = transform({ batchRequest }, (data) => {
      return {
        toCreate: data.batchRequest.create.length,
        toUpdate: data.batchRequest.update.length,
      }
    })

    waitConfirmationProductImportStep()

    // Q: Can we somehow access the error from the step that threw here? Or in a compensate step at least?
    const failureNotification = transform({ input }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product import",
            description: `Failed to import products from file ${data.input.filename}`,
          },
        },
      ]
    })

    notifyOnFailureStep(failureNotification)

    batchProductsWorkflow
      .runAsStep({ input: batchRequest })
      .config({ async: true, backgroundExecution: true })

    const notifications = transform({ input }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product import",
            description: `Product import of file ${data.input.filename} completed successfully!`,
          },
        },
      ]
    })
    sendNotificationsStep(notifications)
    return new WorkflowResponse(summary)
  }
)
