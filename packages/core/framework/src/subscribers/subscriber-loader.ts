import { Event, IEventBusModuleService, Subscriber } from "@medusajs/types"
import {
  dynamicImport,
  kebabCase,
  Modules,
  promiseAll,
  resolveExports,
} from "@medusajs/utils"
import { access, readdir } from "fs/promises"
import { join, parse } from "path"

import { configManager } from "../config"
import { container } from "../container"
import { logger } from "../logger"
import { SubscriberArgs, SubscriberConfig } from "./types"

type SubscriberHandler<T> = (args: SubscriberArgs<T>) => Promise<void>

type SubscriberModule<T> = {
  config: SubscriberConfig
  handler: SubscriberHandler<T>
}

export class SubscriberLoader {
  /**
   * The options of the plugin from which the subscribers are being loaded
   * @private
   */
  #pluginOptions: Record<string, unknown>

  /**
   * The base directory from which to scan for the subscribers
   * @private
   */
  #sourceDir: string | string[]

  /**
   * The list of file names to exclude from the subscriber scan
   * @private
   */
  #excludes: RegExp[] = [
    /index\.js/,
    /index\.ts/,
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts|\.md)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  /**
   * Map of subscribers descriptors to consume in the loader
   * @private
   */
  #subscriberDescriptors: Map<string, SubscriberModule<any>> = new Map()

  constructor(
    sourceDir: string | string[],
    options: Record<string, unknown> = {}
  ) {
    this.#sourceDir = sourceDir
    this.#pluginOptions = options
  }

  private validateSubscriber(
    subscriber: any,
    path: string
  ): subscriber is {
    default: SubscriberHandler<unknown>
    config: SubscriberConfig
  } {
    const handler = subscriber.default

    if (!handler || typeof handler !== "function") {
      /**
       * If the handler is not a function, we can't use it
       */
      logger.warn(`The subscriber in ${path} is not a function. skipped.`)
      return false
    }

    const config = subscriber.config

    if (!config) {
      /**
       * If the subscriber is missing a config, we can't use it
       */
      logger.warn(`The subscriber in ${path} is missing a config. skipped.`)
      return false
    }

    if (!config.event) {
      /**
       * If the subscriber is missing an event, we can't use it.
       * In production we throw an error, else we log a warning
       */
      if (configManager.isProduction) {
        throw new Error(
          `The subscriber in ${path} is missing an event in the config.`
        )
      } else {
        logger.warn(
          `The subscriber in ${path} is missing an event in the config. skipped.`
        )
      }

      return false
    }

    const events = Array.isArray(config.event) ? config.event : [config.event]

    if (events.some((e: unknown) => !(typeof e === "string"))) {
      /**
       * If the subscribers event is not a string or an array of strings, we can't use it
       */
      logger.warn(
        `The subscriber in ${path} has an invalid event config. The event must be a string or an array of strings. skipped.`
      )
      return false
    }

    return true
  }

  private async createDescriptor(absolutePath: string) {
    return await dynamicImport(absolutePath).then((module_) => {
      module_ = resolveExports(module_)
      const isValid = this.validateSubscriber(module_, absolutePath)

      if (!isValid) {
        return
      }

      this.#subscriberDescriptors.set(absolutePath, {
        config: module_.config,
        handler: module_.default,
      })
    })
  }

  private async createMap(dirPath: string) {
    const promises = await readdir(dirPath, {
      recursive: true,
      withFileTypes: true,
    }).then(async (entries) => {
      const fileEntries = entries.filter((entry) => {
        return (
          !entry.isDirectory() &&
          !this.#excludes.some((exclude) => exclude.test(entry.name))
        )
      })

      logger.debug(`Registering subscribers from ${dirPath}.`)

      return fileEntries.flatMap(async (entry) => {
        const fullPath = join(entry.path, entry.name)
        return await this.createDescriptor(fullPath)
      })
    })

    await promiseAll(promises)
  }

  private inferIdentifier<T>(
    fileName: string,
    { context }: SubscriberConfig,
    handler: SubscriberHandler<T>
  ) {
    /**
     * If subscriberId is provided, use that
     */
    if (context?.subscriberId) {
      return context.subscriberId
    }

    const handlerName = handler.name

    /**
     * If the handler is not anonymous, use the name
     */
    if (handlerName && !handlerName.startsWith("_default")) {
      return kebabCase(handlerName)
    }

    /**
     * If the handler is anonymous, use the file name
     */
    const idFromFile = parse(fileName).name
    return kebabCase(idFromFile)
  }

  private createSubscriber<T = unknown>({
    fileName,
    config,
    handler,
  }: {
    fileName: string
    config: SubscriberConfig
    handler: SubscriberHandler<T>
  }) {
    const eventBusService: IEventBusModuleService = container.resolve(
      Modules.EVENT_BUS
    )

    const { event } = config

    const events = Array.isArray(event) ? event : [event]

    const subscriberId = this.inferIdentifier(fileName, config, handler)

    for (const e of events) {
      const subscriber = async (data: T) => {
        return await handler({
          event: { name: e, ...data } as unknown as Event<T>,
          container,
          pluginOptions: this.#pluginOptions,
        })
      }

      eventBusService.subscribe(e, subscriber as Subscriber, {
        ...config.context,
        subscriberId,
      })
    }
  }

  async load() {
    const normalizeSourcePaths = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]
    const promises = normalizeSourcePaths.map(async (sourcePath) => {
      try {
        await access(sourcePath)
      } catch {
        logger.info(`No subscribers to load from ${sourcePath}. skipped.`)
        return
      }

      return await this.createMap(sourcePath)
    })

    await promiseAll(promises)

    for (const [
      fileName,
      { config, handler },
    ] of this.#subscriberDescriptors.entries()) {
      this.createSubscriber({
        fileName,
        config,
        handler,
      })
    }

    logger.debug(`Subscribers registered.`)

    /**
     * Return the file paths of the registered subscribers, to prevent the
     * backwards compatible loader from trying to register them.
     */
    return [...this.#subscriberDescriptors.keys()]
  }
}
