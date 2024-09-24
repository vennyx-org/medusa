import { logger } from "@medusajs/framework"
import { Modules } from "@medusajs/utils"
import express from "express"
import { track } from "medusa-telemetry"
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
    /**
     * Enabling worker mode to prevent discovering/loading
     * of API routes from the starter kit
     */
    process.env.MEDUSA_WORKER_MODE = "worker"

    const { container } = await loaders({
      directory,
      expressApp: app,
    })

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
