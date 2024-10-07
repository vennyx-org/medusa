import { CreateLocationFulfillmentSetWorkflowInputDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createFulfillmentSets } from "../../fulfillment"
import { associateFulfillmentSetsWithLocationStep } from "../steps/associate-locations-with-fulfillment-sets"

export const createLocationFulfillmentSetWorkflowId =
  "create-location-fulfillment-set"
/**
 * This workflow creates links between location and fulfillment set records.
 */
export const createLocationFulfillmentSetWorkflow = createWorkflow(
  createLocationFulfillmentSetWorkflowId,
  (input: WorkflowData<CreateLocationFulfillmentSetWorkflowInputDTO>) => {
    const fulfillmentSet = createFulfillmentSets([
      {
        name: input.fulfillment_set_data.name,
        type: input.fulfillment_set_data.type,
      },
    ])

    const data = transform({ input, fulfillmentSet }, (data) => [
      {
        location_id: data.input.location_id,
        fulfillment_set_ids: [data.fulfillmentSet[0].id],
      },
    ])

    associateFulfillmentSetsWithLocationStep({
      input: data,
    })
  }
)
