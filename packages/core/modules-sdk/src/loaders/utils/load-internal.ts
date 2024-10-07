import {
  Constructor,
  IModuleService,
  InternalModuleDeclaration,
  LoaderOptions,
  Logger,
  MedusaContainer,
  ModuleExports,
  ModuleLoaderFunction,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  defineJoinerConfig,
  DmlEntity,
  dynamicImport,
  MedusaModuleType,
  ModulesSdkUtils,
  resolveExports,
  toMikroOrmEntities,
} from "@medusajs/utils"
import { asFunction, asValue } from "awilix"
import { statSync } from "fs"
import { readdir } from "fs/promises"
import { join, resolve } from "path"
import { MODULE_RESOURCE_TYPE } from "../../types"

type ModuleResource = {
  services: Function[]
  models: Function[]
  repositories: Function[]
  loaders: ModuleLoaderFunction[]
  moduleService: Constructor<any>
  normalizedPath: string
}

type MigrationFunction = (
  options: LoaderOptions<any>,
  moduleDeclaration?: InternalModuleDeclaration
) => Promise<void>

export async function loadInternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean
): Promise<{ error?: Error } | void> {
  const keyName = !loaderOnly
    ? resolution.definition.key
    : resolution.definition.key + "__loaderOnly"

  const { resources } =
    resolution.moduleDeclaration as InternalModuleDeclaration

  let loadedModule: ModuleExports
  try {
    // When loading manually, we pass the exports to be loaded, meaning that we do not need to import the package to find
    // the exports. This is useful when a package export an initialize function which will bootstrap itself and therefore
    // does not need to import the package that is currently being loaded as it would create a
    // circular reference.
    const modulePath = resolution.resolutionPath as string

    if (resolution.moduleExports) {
      // TODO:
      // If we want to benefit from the auto load mechanism, even if the module exports is provided, we need to ask for the module path
      loadedModule = resolution.moduleExports
    } else {
      loadedModule = await dynamicImport(modulePath)
      loadedModule = (loadedModule as any).default
    }
  } catch (error) {
    if (
      resolution.definition.isRequired &&
      resolution.definition.defaultPackage
    ) {
      return {
        error: new Error(
          `Make sure you have installed the default package: ${resolution.definition.defaultPackage}`
        ),
      }
    }

    return { error }
  }

  let moduleResources = {} as ModuleResource

  if (resolution.resolutionPath) {
    moduleResources = await loadResources(
      resolution,
      logger,
      loadedModule?.loaders ?? []
    )
  }

  if (!loadedModule?.service && !moduleResources.moduleService) {
    container.register({
      [keyName]: asValue(undefined),
    })

    return {
      error: new Error(
        `No service found in module ${resolution?.definition?.label}. Make sure your module exports a service.`
      ),
    }
  }

  if (migrationOnly) {
    const moduleService_ = moduleResources.moduleService ?? loadedModule.service

    // Partially loaded module, only register the service __joinerConfig function to be able to resolve it later
    const moduleService = {
      __joinerConfig: moduleService_.prototype.__joinerConfig,
    }

    container.register({
      [keyName]: asValue(moduleService),
    })
    return
  }

  const localContainer = createMedusaContainer()

  const dependencies = resolution?.dependencies ?? []
  if (resources === MODULE_RESOURCE_TYPE.SHARED) {
    dependencies.push(
      ContainerRegistrationKeys.MANAGER,
      ContainerRegistrationKeys.CONFIG_MODULE,
      ContainerRegistrationKeys.LOGGER,
      ContainerRegistrationKeys.PG_CONNECTION
    )
  }

  for (const dependency of dependencies) {
    localContainer.register(
      dependency,
      asFunction(() => {
        return container.resolve(dependency, { allowUnregistered: true })
      })
    )
  }

  if (resolution.definition.__passSharedContainer) {
    localContainer.register(
      "sharedContainer",
      asFunction(() => {
        return container
      })
    )
  }

  const loaders = moduleResources.loaders ?? loadedModule?.loaders ?? []
  const error = await runLoaders(loaders, {
    container,
    localContainer,
    logger,
    resolution,
    loaderOnly,
    keyName,
  })

  if (error) {
    return error
  }

  const moduleService = moduleResources.moduleService ?? loadedModule.service

  container.register({
    [keyName]: asFunction((cradle) => {
      ;(moduleService as any).__type = MedusaModuleType
      return new moduleService(
        localContainer.cradle,
        resolution.options,
        resolution.moduleDeclaration
      )
    }).singleton(),
  })

  if (loaderOnly) {
    // The expectation is only to run the loader as standalone, so we do not need to register the service and we need to cleanup all services
    const service = container.resolve<IModuleService>(keyName)
    await service.__hooks?.onApplicationPrepareShutdown?.()
    await service.__hooks?.onApplicationShutdown?.()
  }
}

export async function loadModuleMigrations(
  resolution: ModuleResolution,
  moduleExports?: ModuleExports
): Promise<{
  runMigrations?: MigrationFunction
  revertMigration?: MigrationFunction
  generateMigration?: MigrationFunction
}> {
  let loadedModule: ModuleExports
  try {
    loadedModule =
      moduleExports ??
      (await dynamicImport(resolution.resolutionPath as string))

    let runMigrations = loadedModule.runMigrations
    let revertMigration = loadedModule.revertMigration
    let generateMigration = loadedModule.generateMigration

    if (!runMigrations || !revertMigration) {
      const moduleResources = await loadResources(
        resolution,
        console as unknown as Logger,
        loadedModule?.loaders ?? []
      )

      const migrationScriptOptions = {
        moduleName: resolution.definition.key,
        models: moduleResources.models,
        pathToMigrations: join(moduleResources.normalizedPath, "migrations"),
      }

      runMigrations ??= ModulesSdkUtils.buildMigrationScript(
        migrationScriptOptions
      )

      revertMigration ??= ModulesSdkUtils.buildRevertMigrationScript(
        migrationScriptOptions
      )

      generateMigration ??= ModulesSdkUtils.buildGenerateMigrationScript(
        migrationScriptOptions
      )
    }

    return { runMigrations, revertMigration, generateMigration }
  } catch {
    return {}
  }
}

async function importAllFromDir(path: string) {
  let filesToLoad: string[] = []

  const excludedExtensions = [".ts.map", ".js.map", ".d.ts"]

  await readdir(path).then((files) => {
    files.forEach((file) => {
      if (
        file.startsWith("index.") ||
        excludedExtensions.some((ext) => file.endsWith(ext))
      ) {
        return
      }

      const filePath = join(path, file)
      const stats = statSync(filePath)

      if (stats.isDirectory()) {
        // TODO: should we handle that? dont think so but I put that here for discussion
      } else if (stats.isFile()) {
        filesToLoad.push(filePath)
      }
    })

    return filesToLoad
  })

  return (
    await Promise.all(filesToLoad.map((filePath) => import(filePath)))
  ).flatMap((value) => {
    return Object.values(resolveExports(value))
  })
}

export async function loadResources(
  moduleResolution: ModuleResolution,
  logger: Logger = console as unknown as Logger,
  loadedModuleLoaders?: ModuleLoaderFunction[]
): Promise<ModuleResource> {
  let modulePath = moduleResolution.resolutionPath as string
  let normalizedPath = modulePath
    .replace("index.js", "")
    .replace("index.ts", "")
  normalizedPath = resolve(normalizedPath)

  try {
    const defaultOnFail = () => {
      return []
    }

    const [moduleService, services, models, repositories] = await Promise.all([
      import(modulePath).then((moduleExports) => {
        return resolveExports(moduleExports).default.service
      }),
      importAllFromDir(resolve(normalizedPath, "services")).catch(
        defaultOnFail
      ),
      importAllFromDir(resolve(normalizedPath, "models")).catch(defaultOnFail),
      importAllFromDir(resolve(normalizedPath, "repositories")).catch(
        defaultOnFail
      ),
    ])

    const cleanupResources = (resources) => {
      return Object.values(resources)
        .map((resource) => {
          if (DmlEntity.isDmlEntity(resource)) {
            return resource
          }

          if (typeof resource === "function") {
            return resource
          }

          return null
        })
        .filter((v): v is Function => !!v)
    }

    const potentialServices = [...new Set(cleanupResources(services))]
    const potentialModels = [...new Set(cleanupResources(models))]
    const mikroOrmModels = toMikroOrmEntities(potentialModels)
    const potentialRepositories = [...new Set(cleanupResources(repositories))]

    const finalLoaders = prepareLoaders({
      loadedModuleLoaders,
      models: mikroOrmModels,
      repositories: potentialRepositories,
      services: potentialServices,
      moduleResolution,
      migrationPath: normalizedPath + "/migrations",
    })

    generateJoinerConfigIfNecessary({
      moduleResolution,
      service: moduleService,
      models: potentialModels,
    })

    return {
      services: potentialServices,
      models: mikroOrmModels,
      repositories: potentialRepositories,
      loaders: finalLoaders,
      moduleService,
      normalizedPath,
    }
  } catch (e) {
    logger.warn(
      `Unable to load resources for module ${modulePath} automagically. ${e.message}`
    )

    return {} as ModuleResource
  }
}

async function runLoaders(
  loaders: Function[] = [],
  { localContainer, container, logger, resolution, loaderOnly, keyName }
): Promise<void | { error: Error }> {
  try {
    for (const loader of loaders) {
      await loader(
        {
          container: localContainer,
          logger,
          options: resolution.options,
          dataLoaderOnly: loaderOnly,
        },
        resolution.moduleDeclaration as InternalModuleDeclaration
      )
    }
  } catch (err) {
    container.register({
      [keyName]: asValue(undefined),
    })

    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }
}

function prepareLoaders({
  loadedModuleLoaders = [] as ModuleLoaderFunction[],
  models,
  repositories,
  services,
  moduleResolution,
  migrationPath,
}) {
  const finalLoaders: ModuleLoaderFunction[] = []

  const toObjectReducer = (acc, curr) => {
    acc[curr.name] = curr
    return acc
  }

  /*
   * If no connectionLoader function is provided, create a default connection loader.
   * TODO: Validate naming convention
   */
  const connectionLoaderName = "connectionLoader"
  const containerLoader = "containerLoader"

  const hasConnectionLoader = loadedModuleLoaders.some(
    (l) => l.name === connectionLoaderName
  )

  if (!hasConnectionLoader && models.length > 0) {
    const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
      moduleName: moduleResolution.definition.key,
      moduleModels: models,
      migrationsPath: migrationPath,
    })
    finalLoaders.push(connectionLoader)
  }

  const hasContainerLoader = loadedModuleLoaders.some(
    (l) => l.name === containerLoader
  )

  if (!hasContainerLoader) {
    const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
      moduleModels: models.reduce(toObjectReducer, {}),
      moduleRepositories: repositories.reduce(toObjectReducer, {}),
      moduleServices: services.reduce(toObjectReducer, {}),
    })
    finalLoaders.push(containerLoader)
  }

  finalLoaders.push(
    ...loadedModuleLoaders.filter((loader) => {
      if (
        loader.name !== connectionLoaderName &&
        loader.name !== containerLoader
      ) {
        return true
      }

      return (
        (loader.name === containerLoader && hasContainerLoader) ||
        (loader.name === connectionLoaderName && hasConnectionLoader)
      )
    })
  )

  return finalLoaders
}

function generateJoinerConfigIfNecessary({
  moduleResolution,
  service,
  models,
}: {
  moduleResolution: ModuleResolution
  service: Constructor<IModuleService>
  models: (Function | DmlEntity<any, any>)[]
}) {
  const originalJoinerConfigFn = service.prototype.__joinerConfig

  service.prototype.__joinerConfig = function () {
    if (originalJoinerConfigFn) {
      return {
        serviceName: moduleResolution.definition.key,
        ...originalJoinerConfigFn(),
      }
    }

    return defineJoinerConfig(moduleResolution.definition.key, {
      models,
    })
  }
}
