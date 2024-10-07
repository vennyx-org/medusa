import {
  ConfigModule,
  MedusaContainer,
  PluginDetails,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  GraphQLSchema,
  promiseAll,
} from "@medusajs/framework/utils"
import { asValue } from "awilix"
import { Express, NextFunction, Request, Response } from "express"
import { join } from "path"
import requestIp from "request-ip"
import { v4 } from "uuid"
import adminLoader from "./admin"
import apiLoader from "./api"
import { configLoader } from "@medusajs/framework/config"
import { expressLoader } from "@medusajs/framework/http"
import { JobLoader } from "@medusajs/framework/jobs"
import { LinkLoader } from "@medusajs/framework/links"
import { logger } from "@medusajs/framework/logger"
import { container, MedusaAppLoader } from "@medusajs/framework"
import { pgConnectionLoader } from "@medusajs/framework/database"
import { SubscriberLoader } from "@medusajs/framework/subscribers"
import { WorkflowLoader } from "@medusajs/framework/workflows"
import { featureFlagsLoader } from "@medusajs/framework/feature-flags"
import { getResolvedPlugins } from "./helpers/resolve-plugins"

type Options = {
  directory: string
  expressApp: Express
}

const isWorkerMode = (configModule) => {
  return configModule.projectConfig.workerMode === "worker"
}

const shouldLoadBackgroundProcessors = (configModule) => {
  return (
    configModule.projectConfig.workerMode === "worker" ||
    configModule.projectConfig.workerMode === "shared"
  )
}

async function subscribersLoader(plugins: PluginDetails[]) {
  const pluginSubscribersSourcePaths = [
    /**
     * Load subscribers from the medusa/medusa package. Remove once the medusa core is converted to a plugin
     */
    join(__dirname, "../subscribers"),
  ].concat(plugins.map((plugin) => join(plugin.resolve, "subscribers")))

  const subscriberLoader = new SubscriberLoader(pluginSubscribersSourcePaths)
  await subscriberLoader.load()
}

async function jobsLoader(plugins: PluginDetails[]) {
  const pluginJobSourcePaths = [
    /**
     * Load jobs from the medusa/medusa package. Remove once the medusa core is converted to a plugin
     */
    join(__dirname, "../jobs"),
  ].concat(plugins.map((plugin) => join(plugin.resolve, "jobs")))

  const jobLoader = new JobLoader(pluginJobSourcePaths)
  await jobLoader.load()
}

async function loadEntrypoints(
  plugins: PluginDetails[],
  container: MedusaContainer,
  expressApp: Express,
  rootDirectory: string
) {
  const configModule: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  if (shouldLoadBackgroundProcessors(configModule)) {
    await subscribersLoader(plugins)
    await jobsLoader(plugins)
  }

  if (isWorkerMode(configModule)) {
    return async () => {}
  }

  const { shutdown } = await expressLoader({
    app: expressApp,
  })

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    req.scope = container.createScope() as MedusaContainer
    req.requestId = (req.headers["x-request-id"] as string) ?? v4()
    next()
  })

  // Add additional information to context of request
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const ipAddress = requestIp.getClientIp(req) as string
    ;(req as any).request_context = {
      ip_address: ipAddress,
    }
    next()
  })

  await adminLoader({ app: expressApp, configModule, rootDirectory })
  await apiLoader({
    container,
    plugins,
    app: expressApp,
  })

  return shutdown
}

export async function initializeContainer(
  rootDirectory: string
): Promise<MedusaContainer> {
  configLoader(rootDirectory, "medusa-config.js")
  await featureFlagsLoader(join(__dirname, "feature-flags"))

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(logger),
    [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
  })

  pgConnectionLoader()
  return container
}

export default async ({
  directory: rootDirectory,
  expressApp,
}: Options): Promise<{
  container: MedusaContainer
  app: Express
  shutdown: () => Promise<void>
  gqlSchema?: GraphQLSchema
}> => {
  const container = await initializeContainer(rootDirectory)
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(rootDirectory, configModule, true) || []
  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  await new LinkLoader(linksSourcePaths).load()

  const {
    onApplicationStart,
    onApplicationShutdown,
    onApplicationPrepareShutdown,
    gqlSchema,
  } = await new MedusaAppLoader().load()

  const workflowsSourcePaths = plugins.map((p) => join(p.resolve, "workflows"))
  const workflowLoader = new WorkflowLoader(workflowsSourcePaths)
  await workflowLoader.load()

  const entrypointsShutdown = await loadEntrypoints(
    plugins,
    container,
    expressApp,
    rootDirectory
  )

  const { createDefaultsWorkflow } = await import("@medusajs/core-flows")
  await createDefaultsWorkflow(container).run()
  await onApplicationStart()

  const shutdown = async () => {
    const pgConnection = container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    )

    await onApplicationPrepareShutdown()
    await onApplicationShutdown()

    await promiseAll([
      container.dispose(),
      // @ts-expect-error "Do we want to call `client.destroy` "
      pgConnection?.context?.destroy(),
      entrypointsShutdown(),
    ])
  }

  return {
    container,
    app: expressApp,
    shutdown,
    gqlSchema,
  }
}
