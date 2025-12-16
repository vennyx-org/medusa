import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { track } from "@medusajs/telemetry"
import express from "express"
import loaders from "../loaders"

export default async function ({
  directory,
  id,
  email,
  password,
  keepAlive,
  invite,
}) {
  track("CLI_USER", { with_id: !!id })
  const app = express()
  try {
    process.env.MEDUSA_WORKER_MODE = "server"

    const { container } = await loaders({
      directory,
      expressApp: app,
      skipLoadingEntryPoints: true,
    })
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const userService = container.resolve(Modules.USER)
    const authService = container.resolve(Modules.AUTH)

    const provider = "emailpass"

    if (invite) {
      const invite = await userService.createInvites({ email })

      logger.info(`
      Invite token: ${invite.token}
      Open the invite in Medusa Admin at: [your-admin-url]/invite?token=${invite.token}`)
    } else {
      const user = await userService.createUsers({ email })

      const { authIdentity, error } = await authService.register(provider, {
        body: {
          email,
          password,
        },
      })

      if (error) {
        logger.error(error)
        process.exit(1)
      }

      // We know the authIdentity is not undefined
      await authService.updateAuthIdentities({
        id: authIdentity!.id,
        app_metadata: {
          user_id: user.id,
        },
      })

      logger.info("User created successfully.")
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  track("CLI_USER_COMPLETED", { with_id: !!id })

  if (!keepAlive) {
    process.exit()
  }
}
