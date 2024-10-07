#!/usr/bin/env node

import os from "os"
import util from "util"
import createCli from "./create-cli"

const useJsonLogger = process.argv.slice(2).some((arg) => arg.includes(`json`))

if (useJsonLogger) {
  process.env.GATSBY_LOGGER = `json`
}

// Ensure stable runs on Windows when started from different shells (i.e. c:\dir vs C:\dir)
if (os.platform() === `win32`) {
  // ensureWindowsDriveLetterIsUppercase()
}

process.on(`unhandledRejection`, (reason) => {
  // This will exit the process in newer Node anyway so lets be consistent
  // across versions and crash

  // reason can be anything, it can be a message, an object, ANYTHING!
  // we convert it to an error object, so we don't crash on structured error validation
  if (!(reason instanceof Error)) {
    reason = new Error(util.format(reason))
  }

  console.log(reason)
  // report.panic(`UNHANDLED REJECTION`, reason as Error)
})

process.on(`uncaughtException`, (error) => {
  console.log(error)
  // report.panic(`UNHANDLED EXCEPTION`, error)
})

createCli(process.argv)
