import { IWorkflowEngineService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout as setTimeoutSync } from "timers"
import { setTimeout } from "timers/promises"
import "../__fixtures__"

jest.setTimeout(300000)

const failTrap = (done) => {
  setTimeoutSync(() => {
    // REF:https://stackoverflow.com/questions/78028715/jest-async-test-with-event-emitter-isnt-ending
    console.warn(
      "Jest is breaking the event emit with its debouncer. This allows to continue the test by managing the timeout of the test manually."
    )
    done()
  }, 5000)
}

// REF:https://stackoverflow.com/questions/78028715/jest-async-test-with-event-emitter-isnt-ending

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  moduleOptions: {
    redis: {
      url: "localhost:6379",
    },
  },
  testSuite: ({ service: workflowOrcModule, medusaApp }) => {
    describe("Testing race condition of the workflow during retry", () => {
      it("should prevent race continuation of the workflow during retryIntervalAwaiting in background execution", (done) => {
        const transactionId = "transaction_id"

        const step0InvokeMock = jest.fn()
        const step1InvokeMock = jest.fn()
        const step2InvokeMock = jest.fn()
        const transformMock = jest.fn()

        const step0 = createStep("step0", async (_) => {
          step0InvokeMock()
          return new StepResponse("result from step 0")
        })

        const step1 = createStep("step1", async (_) => {
          step1InvokeMock()
          await setTimeout(2000)
          return new StepResponse({ isSuccess: true })
        })

        const step2 = createStep("step2", async (input: any) => {
          step2InvokeMock()
          return new StepResponse({ result: input })
        })

        const subWorkflow = createWorkflow("sub-workflow-1", function () {
          const status = step1()
          return new WorkflowResponse(status)
        })

        createWorkflow("workflow-1", function () {
          const build = step0()

          const status = subWorkflow.runAsStep({} as any).config({
            async: true,
            compensateAsync: true,
            backgroundExecution: true,
            retryIntervalAwaiting: 1,
          })

          const transformedResult = transform({ status }, (data) => {
            transformMock()
            return {
              status: data.status,
            }
          })

          step2(transformedResult)
          return new WorkflowResponse(build)
        })

        void workflowOrcModule.subscribe({
          workflowId: "workflow-1",
          transactionId,
          subscriber: (event) => {
            if (event.eventType === "onFinish") {
              expect(step0InvokeMock).toHaveBeenCalledTimes(1)
              expect(step1InvokeMock.mock.calls.length).toBeGreaterThan(1)
              expect(step2InvokeMock).toHaveBeenCalledTimes(1)
              expect(transformMock).toHaveBeenCalledTimes(1)
              setTimeoutSync(done, 500)
            }
          },
        })

        workflowOrcModule
          .run("workflow-1", { transactionId })
          .then(({ result }) => {
            expect(result).toBe("result from step 0")
          })

        failTrap(done)
      })

      it("should prevent race continuation of the workflow compensation during retryIntervalAwaiting in background execution", (done) => {
        const transactionId = "transaction_id"
        const workflowId = "RACE_workflow-1"

        const step0InvokeMock = jest.fn()
        const step0CompensateMock = jest.fn()
        const step1InvokeMock = jest.fn()
        const step1CompensateMock = jest.fn()
        const step2InvokeMock = jest.fn()
        const transformMock = jest.fn()

        const step0 = createStep(
          "RACE_step0",
          async (_) => {
            step0InvokeMock()
            return new StepResponse("result from step 0")
          },
          () => {
            step0CompensateMock()
          }
        )

        const step1 = createStep(
          "RACE_step1",
          async (_) => {
            step1InvokeMock()
            await setTimeout(500)
            throw new Error("error from step 1")
          },
          () => {
            step1CompensateMock()
          }
        )

        const step2 = createStep("RACE_step2", async (input: any) => {
          step2InvokeMock()
          return new StepResponse({ result: input })
        })

        const subWorkflow = createWorkflow("RACE_sub-workflow-1", function () {
          const status = step1()
          return new WorkflowResponse(status)
        })

        createWorkflow(workflowId, function () {
          const build = step0()

          const status = subWorkflow.runAsStep({} as any).config({
            async: true,
            compensateAsync: true,
            backgroundExecution: true,
            retryIntervalAwaiting: 0.1,
          })

          const transformedResult = transform({ status }, (data) => {
            transformMock()
            return {
              status: data.status,
            }
          })

          step2(transformedResult)
          return new WorkflowResponse(build)
        })

        void workflowOrcModule.subscribe({
          workflowId: workflowId,
          transactionId,
          subscriber: (event) => {
            if (event.eventType === "onFinish") {
              expect(step0InvokeMock).toHaveBeenCalledTimes(1)
              expect(step0CompensateMock).toHaveBeenCalledTimes(2) // TODO: review this.
              expect(step1InvokeMock).toHaveBeenCalledTimes(1)
              expect(step1CompensateMock).toHaveBeenCalledTimes(1)
              expect(step2InvokeMock).toHaveBeenCalledTimes(0)
              expect(transformMock).toHaveBeenCalledTimes(0)

              done()
            }
          },
        })

        workflowOrcModule
          .run(workflowId, { transactionId, throwOnError: false })
          .then(({ result }) => {
            expect(result).toBe("result from step 0")
          })

        failTrap(done)
      })
    })
  },
})
