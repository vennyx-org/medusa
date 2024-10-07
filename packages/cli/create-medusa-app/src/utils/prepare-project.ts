import fs from "fs"
import path from "path"
import { Ora } from "ora"
import execute from "./execute.js"
import { EOL } from "os"
import { displayFactBox, FactBoxOptions } from "./facts.js"
import ProcessManager from "./process-manager.js"
import type { Client } from "pg"

const ADMIN_EMAIL = "admin@medusa-test.com"
const STORE_CORS = "http://localhost:8000,https://docs.medusajs.com"
const ADMIN_CORS =
  "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com"
const AUTH_CORS = ADMIN_CORS
const DEFAULT_REDIS_URL = "redis://localhost:6379"

type PrepareOptions = {
  directory: string
  dbName?: string
  dbConnectionString: string
  seed?: boolean
  spinner: Ora
  processManager: ProcessManager
  abortController?: AbortController
  skipDb?: boolean
  migrations?: boolean
  onboardingType?: "default" | "nextjs"
  nextjsDirectory?: string
  client: Client | null
  verbose?: boolean
}

export default async ({
  directory,
  dbName,
  dbConnectionString,
  seed,
  spinner,
  processManager,
  abortController,
  skipDb,
  migrations,
  onboardingType = "default",
  nextjsDirectory = "",
  client,
  verbose = false,
}: PrepareOptions) => {
  // initialize execution options
  const execOptions = {
    cwd: directory,
    signal: abortController?.signal,
  }

  const npxOptions = {
    ...execOptions,
    env: {
      ...process.env,
      npm_config_yes: "yes",
    },
  }

  const factBoxOptions: FactBoxOptions = {
    interval: null,
    spinner,
    processManager,
    message: "",
    title: "",
    verbose,
  }

  // initialize the invite token to return
  let inviteToken: string | undefined = undefined

  // add environment variables
  let env = `MEDUSA_ADMIN_ONBOARDING_TYPE=${onboardingType}${EOL}STORE_CORS=${STORE_CORS}${EOL}ADMIN_CORS=${ADMIN_CORS}${EOL}AUTH_CORS=${AUTH_CORS}${EOL}REDIS_URL=${DEFAULT_REDIS_URL}${EOL}JWT_SECRET=supersecret${EOL}COOKIE_SECRET=supersecret`

  if (!skipDb) {
    if (dbName) {
      env += `${EOL}DB_NAME=${dbName}`
      dbConnectionString = dbConnectionString.replace(dbName, "$DB_NAME")
    }
    env += `${EOL}DATABASE_URL=${dbConnectionString}`
  }

  if (nextjsDirectory) {
    env += `${EOL}MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=${nextjsDirectory}`
  }

  fs.appendFileSync(path.join(directory, `.env`), env)

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    spinner,
    title: "Installing dependencies...",
    processManager,
  })

  await processManager.runProcess({
    process: async () => {
      try {
        await execute([`yarn`, execOptions], { verbose })
      } catch (e) {
        // yarn isn't available
        // use npm
        await execute([`npm install --legacy-peer-deps`, execOptions], {
          verbose,
        })
      }
    },
    ignoreERESOLVE: true,
  })

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: "Installed Dependencies",
  })

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Building Project...",
  })

  await processManager.runProcess({
    process: async () => {
      try {
        await execute([`yarn build`, execOptions], { verbose })
      } catch (e) {
        // yarn isn't available
        // use npm
        await execute([`npm run build`, execOptions], { verbose })
      }
    },
    ignoreERESOLVE: true,
  })

  displayFactBox({ ...factBoxOptions, message: "Project Built" })

  if (!skipDb && migrations) {
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Running Migrations...",
    })

    // run migrations
    await processManager.runProcess({
      process: async () => {
        const proc = await execute(
          ["npx medusa migrations run && npx medusa links sync", npxOptions],
          { verbose, needOutput: true }
        )

        if (client) {
          // check the migrations table is in the database
          // to ensure that migrations ran
          let errorOccurred = false
          try {
            const migrations = await client.query(
              `SELECT * FROM "mikro_orm_migrations"`
            )
            errorOccurred = migrations.rowCount == 0
          } catch (e) {
            // avoid error thrown if the migrations table
            // doesn't exist
            errorOccurred = true
          }

          // ensure that migrations actually ran in case of an uncaught error
          if (errorOccurred && (proc.stderr || proc.stdout)) {
            throw new Error(
              `An error occurred while running migrations: ${
                proc.stderr || proc.stdout
              }`
            )
          }
        }
      },
    })

    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      message: "Ran Migrations",
    })

    // create admin user
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Creating an admin user...",
    })

    await processManager.runProcess({
      process: async () => {
        const proc = await execute(
          [`npx medusa user -e ${ADMIN_EMAIL} --invite`, npxOptions],
          { verbose, needOutput: true }
        )

        // get invite token from stdout
        const match = (proc.stdout as string).match(
          /Invite token: (?<token>.+)/
        )
        inviteToken = match?.groups?.token
      },
    })

    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      message: "Created admin user",
    })

    // TODO for now we just seed the default data
    // we should add onboarding seeding again if it makes
    // since once we re-introduce the onboarding flow.
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Seeding database...",
    })

    await processManager.runProcess({
      process: async () => {
        try {
          await execute([`yarn seed`, execOptions], { verbose })
        } catch (e) {
          // yarn isn't available
          // use npm
          await execute([`npm run seed`, execOptions], { verbose })
        }
      },
      ignoreERESOLVE: true,
    })

    displayFactBox({
      ...factBoxOptions,
      message: "Seeded database with demo data",
    })
  }

  // if installation includes Next.js, retrieve the publishable API key
  // from the backend and add it as an enviornment variable
  if (nextjsDirectory && client) {
    const apiKeys = await client.query(
      `SELECT * FROM "api_key" WHERE type = 'publishable'`
    )

    if (apiKeys.rowCount) {
      const nextjsEnvPath = path.join(
        nextjsDirectory,
        fs.existsSync(path.join(nextjsDirectory, ".env.local"))
          ? ".env.local"
          : ".env.template"
      )

      const originalContent = fs.readFileSync(nextjsEnvPath, "utf-8")

      fs.writeFileSync(
        nextjsEnvPath,
        originalContent.replace(
          "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test",
          `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKeys.rows[0].token}`
        )
      )
    }
  }

  displayFactBox({ ...factBoxOptions, message: "Finished Preparation" })

  return inviteToken
}
