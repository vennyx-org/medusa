import { FormattingOptionsType } from "types"

const authProviderOptions: FormattingOptionsType = {
  "^auth_provider/.*AbstractAuthModuleProvider": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create an auth provider module and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/auth/provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create an Auth Provider Module",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-auth\`.`,
      `## 2. Create the Auth Provider Service

Create the file \`src/modules/my-auth/service.ts\` that holds the module's main service. It must extend the \`AbstractAuthModuleProvider\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-auth/service.ts"
import { AbstractAuthModuleProvider } from "@medusajs/framework/utils"

class MyAuthProviderService extends AbstractAuthModuleProvider {
  // TODO implement methods
}

export default MyAuthProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-auth/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-auth/index.ts"
import MyAuthProviderService from "./service"

export default {
  services: [MyAuthProviderService],
}
\`\`\`

This exports the module's definition, indicating that the \`MyAuthProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Auth Module Provider, add it to the \`providers\` array of the Auth Module:

\`\`\`js title="medusa-config.js"
const { Modules } = require("@medusajs/framework/utils")

// ...

module.exports = defineConfig({
  // ...
  modules: {
    [Modules.AUTH]: {
      resolve: "@medusajs/framework/auth",
      options: {
        providers: [
          {
            resolve: "./modules/my-auth",
            id: "my-auth",
            options: {
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

export default authProviderOptions
