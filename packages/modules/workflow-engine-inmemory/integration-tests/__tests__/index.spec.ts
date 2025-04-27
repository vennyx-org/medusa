import {
  DistributedTransactionType,
  WorkflowManager,
} from "@medusajs/framework/orchestration"
import {
  Context,
  IWorkflowEngineService,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import {
  Module,
  Modules,
  TransactionHandlerType,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { WorkflowsModuleService } from "@services"
import { asFunction } from "awilix"
import { setTimeout as setTimeoutSync } from "timers"
import { setTimeout as setTimeoutPromise } from "timers/promises"
import "../__fixtures__"
import {
  conditionalStep2Invoke,
  conditionalStep3Invoke,
  workflow2Step2Invoke,
  workflow2Step3Invoke,
} from "../__fixtures__"
import {
  eventGroupWorkflowId,
  workflowEventGroupIdStep1Mock,
  workflowEventGroupIdStep2Mock,
} from "../__fixtures__/workflow_event_group_id"
import { createScheduled } from "../__fixtures__/workflow_scheduled"

jest.setTimeout(60000)

const failTrap = (done) => {
  setTimeoutSync(() => {
    // REF:https://stackoverflow.com/questions/78028715/jest-async-test-with-event-emitter-isnt-ending
    console.warn(
      "Jest is breaking the event emit with its debouncer. This allows to continue the test by managing the timeout of the test manually."
    )
    done()
  }, 5000)
}

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  testSuite: ({ service: workflowOrcModule, medusaApp }) => {
    describe("Workflow Orchestrator module", function () {
      let query: RemoteQueryFunction

      beforeEach(() => {
        query = medusaApp.query
      })

      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.WORKFLOW_ENGINE, {
          service: WorkflowsModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual(["workflowExecution"])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          workflowExecution: {
            id: {
              linkable: "workflow_execution_id",
              entity: "WorkflowExecution",
              primaryKey: "id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
            transaction_id: {
              linkable: "workflow_execution_transaction_id",
              entity: "WorkflowExecution",
              primaryKey: "transaction_id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
            workflow_id: {
              linkable: "workflow_execution_workflow_id",
              entity: "WorkflowExecution",
              primaryKey: "workflow_id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
          },
        })
      })

      it("should execute an async workflow keeping track of the event group id provided in the context", async () => {
        const eventGroupId = "event-group-id"

        await workflowOrcModule.run(eventGroupWorkflowId, {
          input: {},
          transactionId: "transaction_id",
          context: {
            eventGroupId,
          },
          throwOnError: true,
        })

        await workflowOrcModule.setStepSuccess({
          idempotencyKey: {
            action: TransactionHandlerType.INVOKE,
            stepId: "step_1_event_group_id_background",
            workflowId: eventGroupWorkflowId,
            transactionId: "transaction_id",
          },
          stepResponse: { hey: "oh" },
        })

        // Validate context event group id
        expect(
          (workflowEventGroupIdStep1Mock.mock.calls[0] as any[])[1]
        ).toEqual(expect.objectContaining({ eventGroupId }))
        expect(
          (workflowEventGroupIdStep2Mock.mock.calls[0] as any[])[1]
        ).toEqual(expect.objectContaining({ eventGroupId }))
      })

      it("should execute an async workflow keeping track of the event group id that has been auto generated", async () => {
        await workflowOrcModule.run(eventGroupWorkflowId, {
          input: {},
          transactionId: "transaction_id_2",
          throwOnError: true,
        })

        await workflowOrcModule.setStepSuccess({
          idempotencyKey: {
            action: TransactionHandlerType.INVOKE,
            stepId: "step_1_event_group_id_background",
            workflowId: eventGroupWorkflowId,
            transactionId: "transaction_id_2",
          },
          stepResponse: { hey: "oh" },
        })

        const generatedEventGroupId = ((
          workflowEventGroupIdStep1Mock.mock.calls[0] as any[]
        )[1] as unknown as Context)!.eventGroupId

        // Validate context event group id
        expect(
          (workflowEventGroupIdStep1Mock.mock.calls[0] as any[])[1]
        ).toEqual(
          expect.objectContaining({ eventGroupId: generatedEventGroupId })
        )
        expect(
          (workflowEventGroupIdStep2Mock.mock.calls[0] as any[])[1]
        ).toEqual(
          expect.objectContaining({ eventGroupId: generatedEventGroupId })
        )
      })

      it("should compose nested workflows w/ async steps", (done) => {
        const asyncResults: any[] = []
        const mockStep1Fn = jest.fn().mockImplementation(() => {
          const res = { obj: "return from 1" }
          asyncResults.push(res)
          return new StepResponse(res)
        })
        const mockStep2Fn = jest.fn().mockImplementation(async () => {
          await setTimeoutPromise(100)
          const res = { obj: "return from 2" }
          asyncResults.push(res)
          return new StepResponse(res)
        })

        const mockStep3Fn = jest.fn().mockImplementation(() => {
          const res = { obj: "return from 3" }
          asyncResults.push(res)
          return new StepResponse(res)
        })

        const step1 = createStep("step1", mockStep1Fn)
        const step2 = createStep(
          {
            name: "step2",
            async: true,
            backgroundExecution: true,
          },
          mockStep2Fn
        )
        const step3 = createStep("step3", mockStep3Fn)

        const wf3 = createWorkflow("workflow3", function (input) {
          return new WorkflowResponse(step2(input))
        })

        const wf2 = createWorkflow("workflow2", function (input) {
          const ret3 = wf3.runAsStep({
            input: {},
          })
          return new WorkflowResponse(ret3)
        })

        const workflowId = "workflow1"
        createWorkflow(workflowId, function (input) {
          step1(input)
          wf2.runAsStep({ input })
          const fourth = step3({})
          return new WorkflowResponse(fourth)
        })

        asyncResults.push("begin workflow")
        workflowOrcModule
          .run(workflowId, {
            input: {},
          })
          .then(() => {
            asyncResults.push("returned workflow")

            void workflowOrcModule.subscribe({
              workflowId,
              subscriber: (event) => {
                if (event.eventType === "onFinish") {
                  expect(asyncResults).toEqual([
                    "begin workflow",
                    { obj: "return from 1" },
                    "returned workflow",
                    { obj: "return from 2" },
                    { obj: "return from 3" },
                  ])
                }
              },
            })
          })

        failTrap(done)
      })

      describe("Testing basic workflow", function () {
        beforeEach(() => {
          jest.clearAllMocks()
        })

        it("should return a list of workflow executions and remove after completed when there is no retentionTime set", async () => {
          await workflowOrcModule.run("workflow_1", {
            input: {
              value: "123",
            },
            throwOnError: true,
          })

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["workflow_id", "transaction_id", "state"],
          })

          expect(executionsList).toHaveLength(1)

          const { result } = await workflowOrcModule.setStepSuccess({
            idempotencyKey: {
              action: TransactionHandlerType.INVOKE,
              stepId: "new_step_name",
              workflowId: "workflow_1",
              transactionId: executionsList[0].transaction_id,
            },
            stepResponse: { uhuuuu: "yeaah!" },
          })

          ;({ data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          }))

          expect(executionsList).toHaveLength(0)
          expect(result).toEqual({
            done: {
              inputFromSyncStep: "oh",
            },
          })
        })

        it("should return a list of workflow executions and keep it saved when there is a retentionTime set", async () => {
          await workflowOrcModule.run("workflow_2", {
            input: {
              value: "123",
            },
            throwOnError: true,
            transactionId: "transaction_1",
          })

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          expect(executionsList).toHaveLength(1)

          await workflowOrcModule.setStepSuccess({
            idempotencyKey: {
              action: TransactionHandlerType.INVOKE,
              stepId: "new_step_name",
              workflowId: "workflow_2",
              transactionId: "transaction_1",
            },
            stepResponse: { uhuuuu: "yeaah!" },
          })

          expect(workflow2Step2Invoke).toBeCalledTimes(2)
          expect(workflow2Step2Invoke.mock.calls[0][0]).toEqual({ hey: "oh" })
          expect(workflow2Step2Invoke.mock.calls[1][0]).toEqual({
            hey: "async hello",
          })

          expect(workflow2Step3Invoke).toBeCalledTimes(1)
          expect(workflow2Step3Invoke.mock.calls[0][0]).toEqual({
            uhuuuu: "yeaah!",
          })
          ;({ data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          }))

          expect(executionsList).toHaveLength(1)
        })

        it("should revert the entire transaction when a step timeout expires", async () => {
          const { transaction } = (await workflowOrcModule.run(
            "workflow_step_timeout",
            {
              input: {},
              throwOnError: false,
            }
          )) as Awaited<{ transaction: DistributedTransactionType }>

          expect(transaction.getFlow().state).toEqual("reverted")
        })

        it("should revert the entire transaction when the transaction timeout expires", async () => {
          const { transaction } = (await workflowOrcModule.run(
            "workflow_transaction_timeout",
            {
              input: {},
              throwOnError: false,
            }
          )) as Awaited<{ transaction: DistributedTransactionType }>

          await setTimeoutPromise(200)

          expect(transaction.getFlow().state).toEqual("reverted")
        })

        it("should subscribe to a async workflow and receive the response when it finishes", (done) => {
          const transactionId = "trx_123"

          const onFinish = jest.fn(() => {
            done()
          })

          void workflowOrcModule.subscribe({
            workflowId: "workflow_async_background",
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                onFinish()
              }
            },
          })

          void workflowOrcModule.run("workflow_async_background", {
            input: {
              myInput: "123",
            },
            transactionId,
            throwOnError: false,
          })

          expect(onFinish).toHaveBeenCalledTimes(0)
          failTrap(done)
        })

        it("should cancel and revert a completed workflow", async () => {
          const workflowId = "workflow_sync"

          const { acknowledgement, transaction: trx } =
            await workflowOrcModule.run(workflowId, {
              input: {
                value: "123",
              },
            })

          expect(trx.getFlow().state).toEqual("done")
          expect(acknowledgement.hasFinished).toBe(true)

          const { transaction } = await workflowOrcModule.cancel(workflowId, {
            transactionId: acknowledgement.transactionId,
          })

          expect(transaction.getFlow().state).toEqual("reverted")
        })

        it("should run conditional steps if condition is true", (done) => {
          void workflowOrcModule.subscribe({
            workflowId: "workflow_conditional_step",
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                done()
                expect(conditionalStep2Invoke).toHaveBeenCalledTimes(2)
                expect(conditionalStep3Invoke).toHaveBeenCalledTimes(1)
              }
            },
          })

          workflowOrcModule.run("workflow_conditional_step", {
            input: {
              runNewStepName: true,
            },
            throwOnError: true,
          })

          failTrap(done)
        })

        it("should not run conditional steps if condition is false", (done) => {
          void workflowOrcModule.subscribe({
            workflowId: "workflow_conditional_step",
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                done()
                expect(conditionalStep2Invoke).toHaveBeenCalledTimes(1)
                expect(conditionalStep3Invoke).toHaveBeenCalledTimes(0)
              }
            },
          })

          workflowOrcModule.run("workflow_conditional_step", {
            input: {
              runNewStepName: false,
            },
            throwOnError: true,
          })

          failTrap(done)
        })
      })

      describe("Scheduled workflows", () => {
        beforeEach(() => {
          jest.useFakeTimers()
          jest.clearAllMocks()

          // Register test-value in the container for all tests
          const sharedContainer =
            workflowOrcModule["workflowOrchestratorService_"]["container_"]

          sharedContainer.register(
            "test-value",
            asFunction(() => "test")
          )
        })

        afterEach(() => {
          jest.useRealTimers()
        })

        it("should execute a scheduled workflow", async () => {
          const spy = createScheduled("standard", {
            cron: "0 0 * * * *", // Runs at the start of every hour
          })

          expect(spy).toHaveBeenCalledTimes(0)

          await jest.runOnlyPendingTimersAsync()

          expect(spy).toHaveBeenCalledTimes(1)

          await jest.runOnlyPendingTimersAsync()

          expect(spy).toHaveBeenCalledTimes(2)
        })

        it("should stop executions after the set number of executions", async () => {
          const spy = await createScheduled("num-executions", {
            interval: 1000,
            numberOfExecutions: 2,
          })

          expect(spy).toHaveBeenCalledTimes(0)

          await jest.advanceTimersByTimeAsync(1100)

          expect(spy).toHaveBeenCalledTimes(1)

          await jest.advanceTimersByTimeAsync(1100)

          expect(spy).toHaveBeenCalledTimes(2)

          await jest.advanceTimersByTimeAsync(1100)

          expect(spy).toHaveBeenCalledTimes(2)
        })

        it("should remove scheduled workflow if workflow no longer exists", async () => {
          const spy = await createScheduled("remove-scheduled", {
            interval: 1000,
          })
          const logSpy = jest.spyOn(console, "warn")

          expect(spy).toHaveBeenCalledTimes(0)

          await jest.advanceTimersByTimeAsync(1100)

          expect(spy).toHaveBeenCalledTimes(1)

          WorkflowManager["workflows"].delete("remove-scheduled")

          await jest.advanceTimersByTimeAsync(1100)
          expect(spy).toHaveBeenCalledTimes(1)
          expect(logSpy).toHaveBeenCalledWith(
            "Tried to execute a scheduled workflow with ID remove-scheduled that does not exist, removing it from the scheduler."
          )
        })

        it("the scheduled workflow should have access to the shared container", async () => {
          const spy = await createScheduled("shared-container-job", {
            interval: 1000,
            numberOfExecutions: 1,
          })

          const initialCallCount = spy.mock.calls.length

          await jest.advanceTimersByTimeAsync(1100)

          expect(spy).toHaveBeenCalledTimes(initialCallCount + 1)
          expect(spy).toHaveReturnedWith(
            expect.objectContaining({ output: { testValue: "test" } })
          )

          await jest.advanceTimersByTimeAsync(1100)

          expect(spy).toHaveBeenCalledTimes(initialCallCount + 1)
        })

        it("should fetch an idempotent workflow after its completion", async () => {
          const { transaction: firstRun } = (await workflowOrcModule.run(
            "workflow_idempotent",
            {
              input: {
                value: "123",
              },
              throwOnError: true,
              transactionId: "transaction_1",
            }
          )) as Awaited<{ transaction: DistributedTransactionType }>

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          const { transaction: secondRun } = (await workflowOrcModule.run(
            "workflow_idempotent",
            {
              input: {
                value: "123",
              },
              throwOnError: true,
              transactionId: "transaction_1",
            }
          )) as Awaited<{ transaction: DistributedTransactionType }>

          const { data: executionsListAfter } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          expect(secondRun.getFlow().startedAt).toEqual(
            firstRun.getFlow().startedAt
          )
          expect(executionsList).toHaveLength(1)
          expect(executionsListAfter).toHaveLength(1)
        })
      })
    })
  },
})
