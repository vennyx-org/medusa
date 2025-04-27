import {
  Context,
  DAL,
  InferEntityType,
  InternalModuleDeclaration,
  ModulesSdkTypes,
  WorkflowsSdkTypes,
} from "@medusajs/framework/types"
import {
  InjectSharedContext,
  isDefined,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/framework/utils"
import type {
  ReturnWorkflow,
  UnwrapWorkflowInputDataType,
} from "@medusajs/framework/workflows-sdk"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { WorkflowExecution } from "@models"
import {
  WorkflowOrchestratorCancelOptions,
  WorkflowOrchestratorService,
} from "@services"

type InjectedDependencies = {
  manager: SqlEntityManager
  baseRepository: DAL.RepositoryService
  workflowExecutionService: ModulesSdkTypes.IMedusaInternalService<any>
  workflowOrchestratorService: WorkflowOrchestratorService
  redisDisconnectHandler: () => Promise<void>
}

export class WorkflowsModuleService<
  TWorkflowExecution extends InferEntityType<
    typeof WorkflowExecution
  > = InferEntityType<typeof WorkflowExecution>
> extends ModulesSdkUtils.MedusaService<{
  WorkflowExecution: { dto: InferEntityType<typeof WorkflowExecution> }
}>({ WorkflowExecution }) {
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: ModulesSdkTypes.IMedusaInternalService<TWorkflowExecution>
  protected workflowOrchestratorService_: WorkflowOrchestratorService
  protected redisDisconnectHandler_: () => Promise<void>
  protected manager_: SqlEntityManager
  private clearTimeout_: NodeJS.Timeout

  constructor(
    {
      manager,
      baseRepository,
      workflowExecutionService,
      workflowOrchestratorService,
      redisDisconnectHandler,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.manager_ = manager
    this.baseRepository_ = baseRepository
    this.workflowExecutionService_ = workflowExecutionService
    this.workflowOrchestratorService_ = workflowOrchestratorService
    this.redisDisconnectHandler_ = redisDisconnectHandler
  }

  __hooks = {
    onApplicationShutdown: async () => {
      await this.workflowOrchestratorService_.onApplicationShutdown()
      await this.redisDisconnectHandler_()
      clearInterval(this.clearTimeout_)
    },
    onApplicationPrepareShutdown: async () => {
      await this.workflowOrchestratorService_.onApplicationPrepareShutdown()
    },
    onApplicationStart: async () => {
      await this.workflowOrchestratorService_.onApplicationStart()

      await this.clearExpiredExecutions()
      this.clearTimeout_ = setInterval(async () => {
        try {
          await this.clearExpiredExecutions()
        } catch {}
      }, 1000 * 60 * 60)
    },
  }

  @InjectSharedContext()
  async run<TWorkflow extends string | ReturnWorkflow<any, any, any>>(
    workflowIdOrWorkflow: TWorkflow,
    options: WorkflowsSdkTypes.WorkflowOrchestratorRunDTO<
      TWorkflow extends ReturnWorkflow<any, any, any>
        ? UnwrapWorkflowInputDataType<TWorkflow>
        : unknown
    > = {},
    @MedusaContext() context: Context = {}
  ) {
    const options_ = JSON.parse(JSON.stringify(options ?? {}))

    const {
      manager,
      transactionManager,
      preventReleaseEvents,
      transactionId,
      parentStepIdempotencyKey,
      ...restContext
    } = context

    let localPreventReleaseEvents = false

    if (isDefined(options_.context?.preventReleaseEvents)) {
      localPreventReleaseEvents = options_.context!.preventReleaseEvents!
    } else {
      if (
        isDefined(context.eventGroupId) &&
        isDefined(options_.context?.eventGroupId) &&
        context.eventGroupId === options_.context?.eventGroupId
      ) {
        localPreventReleaseEvents = true
      }
    }

    let eventGroupId

    if (options_.context?.eventGroupId) {
      eventGroupId = options_.context.eventGroupId
    } else if (localPreventReleaseEvents && context.eventGroupId) {
      eventGroupId = context.eventGroupId
    }

    options_.context = {
      ...(restContext ?? {}),
      ...(options_.context ?? {}),
      eventGroupId,
      preventReleaseEvents: localPreventReleaseEvents,
    }

    const ret = await this.workflowOrchestratorService_.run<
      TWorkflow extends ReturnWorkflow<any, any, any>
        ? UnwrapWorkflowInputDataType<TWorkflow>
        : unknown
    >(workflowIdOrWorkflow, options_)

    return ret as any
  }

  @InjectSharedContext()
  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    @MedusaContext() context: Context = {}
  ) {
    return await this.workflowOrchestratorService_.getRunningTransaction(
      workflowId,
      transactionId,
      context
    )
  }

  @InjectSharedContext()
  async setStepSuccess(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | object
      stepResponse: unknown
      options?: Record<string, any>
    },
    @MedusaContext() context: Context = {}
  ) {
    const options_ = JSON.parse(JSON.stringify(options ?? {}))

    const { manager, transactionManager, ...restContext } = context

    options_.context ??= restContext

    return await this.workflowOrchestratorService_.setStepSuccess({
      idempotencyKey,
      stepResponse,
      options: options_,
    } as any)
  }

  @InjectSharedContext()
  async setStepFailure(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | object
      stepResponse: unknown
      options?: Record<string, any>
    },
    @MedusaContext() context: Context = {}
  ) {
    const options_ = JSON.parse(JSON.stringify(options ?? {}))

    const { manager, transactionManager, ...restContext } = context

    options_.context ??= restContext

    return await this.workflowOrchestratorService_.setStepFailure({
      idempotencyKey,
      stepResponse,
      options: options_,
    } as any)
  }

  @InjectSharedContext()
  async subscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriber: Function
      subscriberId?: string
    },
    @MedusaContext() context: Context = {}
  ) {
    return this.workflowOrchestratorService_.subscribe(args as any)
  }

  @InjectSharedContext()
  async unsubscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriberOrId: string | Function
    },
    @MedusaContext() context: Context = {}
  ) {
    return this.workflowOrchestratorService_.unsubscribe(args as any)
  }

  private async clearExpiredExecutions() {
    return this.manager_.execute(`
      DELETE FROM workflow_execution
      WHERE retention_time IS NOT NULL AND
      updated_at <= (CURRENT_TIMESTAMP - INTERVAL '1 second' * retention_time);
    `)
  }

  @InjectSharedContext()
  async cancel(
    workflowId: string,
    options: WorkflowOrchestratorCancelOptions,
    @MedusaContext() context: Context = {}
  ) {
    return await this.workflowOrchestratorService_.cancel(workflowId, options)
  }
}
