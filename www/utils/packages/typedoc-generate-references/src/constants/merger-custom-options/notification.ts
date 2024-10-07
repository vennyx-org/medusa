import { FormattingOptionsType } from "types"

const notificationOptions: FormattingOptionsType = {
  "^notification/.*AbstractNotificationProviderService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a notification provider module and the methods you must implement in it.`,
    frontmatterData: {
      slug: "/references/notification-provider-module",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Notification Provider Module",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-notification\`.`,
      `## 2. Create the Notification Provider Service

Create the file \`src/modules/my-notification/service.ts\` that holds the implementation of the notification service.

The Notification Provider Module's main service must extend the \`AbstractNotificationProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-notification/service.ts"
import { 
  AbstractNotificationProviderService
} from "@medusajs/framework/utils"

class MyNotificationProviderService extends AbstractNotificationProviderService {
  // TODO add methods
}

export default MyNotificationProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-notification/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-notification/index.ts"
import MyNotificationProviderService from "./service"

export default {
  services: [MyNotificationProviderService],
}
\`\`\`

This exports the module's definition, indicating that the \`MyNotificationProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Notification Module Provider, add it to the \`providers\` array of the Notification Module:

<Note>

The Notification Module accepts one provider per channel.

</Note>

\`\`\`js title="medusa-config.js"
const { Modules } = require("@medusajs/framework/utils")

// ...

module.exports = defineConfig({
  // ...
  modules: {
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/framework/notification",
      options: {
        providers: [
          {
            resolve: "./modules/my-notification",
            id: "my-notification",
            options: {
              channels: ["email"],
              // provider options...
            },
          },
        ],
      },
    },
  }
})
\`\`\`
`,
    ],
  },
}

export default notificationOptions
