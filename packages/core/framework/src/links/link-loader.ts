import { dynamicImport, promiseAll } from "@medusajs/utils"
import { logger } from "../logger"
import { access, readdir } from "fs/promises"
import { join } from "path"

export class LinkLoader {
  /**
   * The directory from which to load the links
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

  constructor(sourceDir: string | string[]) {
    this.#sourceDir = sourceDir
  }

  /**
   * Load links from the source paths, links are registering themselves,
   * therefore we only need to import them
   */
  async load() {
    const normalizedSourcePath = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]

    const promises = normalizedSourcePath.map(async (sourcePath) => {
      try {
        await access(sourcePath)
      } catch {
        logger.info(`No link to load from ${sourcePath}. skipped.`)
        return
      }

      return await readdir(sourcePath, {
        recursive: true,
        withFileTypes: true,
      }).then(async (entries) => {
        const fileEntries = entries.filter((entry) => {
          return (
            !entry.isDirectory() &&
            !this.#excludes.some((exclude) => exclude.test(entry.name))
          )
        })

        logger.debug(`Registering links from ${sourcePath}.`)

        return await promiseAll(
          fileEntries.map(async (entry) => {
            const fullPath = join(entry.path, entry.name)
            return await dynamicImport(fullPath)
          })
        )
      })
    })

    await promiseAll(promises)

    logger.debug(`Links registered.`)
  }
}
