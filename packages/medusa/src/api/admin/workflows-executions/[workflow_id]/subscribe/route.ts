import { IWorkflowEngineService } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    Modules.WORKFLOW_ENGINE
  )

  const { workflow_id } = req.query as any

  const subscriberId = "__sub__" + Math.random().toString(36).substring(2, 9)
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  req.on("close", () => {
    res.end()

    void workflowEngineService.unsubscribe({
      workflowId: workflow_id,
      subscriberOrId: subscriberId,
    })
  })

  req.on("error", (err: any) => {
    if (err.code === "ECONNRESET") {
      res.end()
    }
  })

  void workflowEngineService.subscribe({
    workflowId: workflow_id,
    subscriber: async (args) => {
      const {
        eventType,
        workflowId,
        transactionId,
        step,
        response,
        result,
        errors,
      } = args

      const data = {
        event_type: eventType,
        workflow_id: workflowId,
        transaction_id: transactionId,
        step,
        response,
        result,
        errors,
      }
      res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`)
    },
    subscriberId,
  })
}
