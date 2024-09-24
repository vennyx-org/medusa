import { Logger, MedusaContainer, ModuleResolution } from "@medusajs/types"
import { asValue } from "awilix"
import { EOL } from "os"
import { MODULE_SCOPE } from "../types"
import { loadInternalModule } from "./utils"

export const moduleLoader = async ({
  container,
  moduleResolutions,
  logger,
  migrationOnly,
  loaderOnly,
}: {
  container: MedusaContainer
  moduleResolutions: Record<string, ModuleResolution>
  logger: Logger
  migrationOnly?: boolean
  loaderOnly?: boolean
}): Promise<void> => {
  for (const resolution of Object.values(moduleResolutions ?? {})) {
    const registrationResult = await loadModule(
      container,
      resolution,
      logger!,
      migrationOnly,
      loaderOnly
    )

    if (registrationResult?.error) {
      const { error } = registrationResult
      logger?.error(
        `Could not resolve module: ${resolution.definition.label}. Error: ${error.message}${EOL}`
      )
      throw error
    }
  }
}

async function loadModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean
): Promise<{ error?: Error } | void> {
  const modDefinition = resolution.definition

  if (!modDefinition.key) {
    throw new Error(`Module definition is missing property "key"`)
  }

  const keyName = modDefinition.key
  const { scope, resources } = resolution.moduleDeclaration ?? ({} as any)

  const canSkip =
    !resolution.resolutionPath &&
    !modDefinition.isRequired &&
    !modDefinition.defaultPackage

  if (scope === MODULE_SCOPE.EXTERNAL && !canSkip) {
    // TODO: implement external Resolvers
    // return loadExternalModule(...)
    throw new Error("External Modules are not supported yet.")
  }

  if (!scope || (scope === MODULE_SCOPE.INTERNAL && !resources)) {
    let message = `The module ${resolution.definition.label} has to define its scope (internal | external)`
    if (scope === MODULE_SCOPE.INTERNAL && !resources) {
      message = `The module ${resolution.definition.label} is missing its resources config`
    }

    container.register(keyName, asValue(undefined))

    return {
      error: new Error(message),
    }
  }

  if (resolution.resolutionPath === false) {
    container.register(keyName, asValue(undefined))

    return
  }

  return await loadInternalModule(
    container,
    resolution,
    logger,
    migrationOnly,
    loaderOnly
  )
}
