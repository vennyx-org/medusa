import boxen from "boxen"
import { ChildProcess, execSync, fork } from "child_process"
import chokidar, { FSWatcher } from "chokidar"
import { Store } from "medusa-telemetry"
import { EOL } from "os"
import path from "path"

import { logger } from "@medusajs/framework/logger"
import { MEDUSA_CLI_PATH } from "@medusajs/framework"

const defaultConfig = {
  padding: 5,
  borderColor: `blue`,
  borderStyle: `double`,
} as boxen.Options

export default async function ({ types, directory }) {
  const args = process.argv

  const argv =
    process.argv.indexOf("--") !== -1
      ? process.argv.slice(process.argv.indexOf("--") + 1)
      : []

  args.shift()
  args.shift()
  args.shift()

  if (types) {
    args.push("--types")
  }

  /**
   * Re-constructing the path to Medusa CLI to execute the
   * start command.
   */

  const cliPath = path.resolve(MEDUSA_CLI_PATH, "..", "..", "cli.js")

  const devServer = {
    childProcess: null as ChildProcess | null,
    watcher: null as FSWatcher | null,

    /**
     * Start the development server by forking a new process.
     *
     * We do not kill the parent process when child process dies. This is
     * because sometimes the dev server can die because of programming
     * or logical errors and we can still watch the file system and
     * restart the dev server instead of asking the user to re-run
     * the command.
     */
    start() {
      this.childProcess = fork(cliPath, ["start", ...args], {
        cwd: directory,
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
        execArgv: argv,
      })
      this.childProcess.on("error", (error) => {
        // @ts-ignore
        logger.error("Dev server failed to start", error)
        logger.info("The server will restart automatically after your changes")
      })
    },

    /**
     * Restarts the development server by cleaning up the existing
     * child process and forking a new one
     */
    restart() {
      if (this.childProcess) {
        this.childProcess.removeAllListeners()
        if (process.platform === "win32") {
          execSync(`taskkill /PID ${this.childProcess.pid} /F /T`)
        }
        this.childProcess.kill("SIGINT")
      }
      this.start()
    },

    /**
     * Watches the entire file system and ignores the following files
     *
     * - Dot files
     * - node_modules
     * - dist
     * - src/admin/**
     */
    watch() {
      this.watcher = chokidar.watch(["."], {
        ignoreInitial: true,
        cwd: process.cwd(),
        ignored: [
          /(^|[\\/\\])\../,
          "node_modules",
          "dist",
          "static",
          "private",
          "src/admin/**/*",
          ".medusa/**/*",
        ],
      })

      this.watcher.on("add", (file) => {
        logger.info(
          `${path.relative(directory, file)} created: Restarting dev server`
        )
        this.restart()
      })
      this.watcher.on("change", (file) => {
        logger.info(
          `${path.relative(directory, file)} modified: Restarting dev server`
        )
        this.restart()
      })
      this.watcher.on("unlink", (file) => {
        logger.info(
          `${path.relative(directory, file)} removed: Restarting dev server`
        )
        this.restart()
      })

      this.watcher.on("ready", function () {
        logger.info(`Watching filesystem to reload dev server on file change`)
      })
    },
  }

  process.on("SIGINT", () => {
    const configStore = new Store()
    const hasPrompted = configStore.getConfig("star.prompted") ?? false
    if (!hasPrompted) {
      const defaultMessage =
        `✨ Thanks for using Medusa. ✨${EOL}${EOL}` +
        `If you liked it, please consider starring us on GitHub${EOL}` +
        `https://medusajs.com/star${EOL}` +
        `${EOL}` +
        `Note: you will not see this message again.`

      console.log()
      console.log(boxen(defaultMessage, defaultConfig))

      configStore.setConfig("star.prompted", true)
    }
    process.exit(0)
  })

  devServer.start()
  devServer.watch()
}
