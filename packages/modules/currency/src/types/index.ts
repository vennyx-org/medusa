import { IEventBusModuleService, Logger } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}
