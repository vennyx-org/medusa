import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  createPgConnection,
  promiseAll,
} from "@medusajs/framework/utils"

export interface InitModulesOptions {
  injectedDependencies?: Record<string, unknown>
  databaseConfig: {
    clientUrl: string
    schema?: string
  }
  modulesConfig: {
    [key: string]:
      | string
      | boolean
      | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  }
  joinerConfig?: ModuleJoinerConfig[]
  preventConnectionDestroyWarning?: boolean
}

export async function initModules({
  injectedDependencies,
  databaseConfig,
  modulesConfig,
  joinerConfig,
  preventConnectionDestroyWarning = false,
}: InitModulesOptions) {
  const moduleSdkImports = require("@medusajs/framework/modules-sdk")

  injectedDependencies ??= {}

  let sharedPgConnection =
    injectedDependencies?.[ContainerRegistrationKeys.PG_CONNECTION]

  let shouldDestroyConnectionAutomatically = !sharedPgConnection
  if (!sharedPgConnection) {
    sharedPgConnection = createPgConnection({
      clientUrl: databaseConfig.clientUrl,
      schema: databaseConfig.schema,
    })

    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] =
      sharedPgConnection
  }

  const medusaApp = await moduleSdkImports.MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    injectedDependencies,
  })

  await medusaApp.onApplicationStart()

  async function shutdown() {
    if (shouldDestroyConnectionAutomatically) {
      await medusaApp.onApplicationPrepareShutdown()

      await promiseAll([
        (sharedPgConnection as any).context?.destroy(),
        (sharedPgConnection as any).destroy(),
        medusaApp.onApplicationShutdown(),
      ])
    } else {
      if (!preventConnectionDestroyWarning) {
        console.info(
          `You are using a custom shared connection. The connection won't be destroyed automatically.`
        )
      }
    }
    moduleSdkImports.MedusaModule.clearInstances()
  }

  return {
    medusaApp,
    shutdown,
  }
}
