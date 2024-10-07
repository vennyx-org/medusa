import { ModuleProviderExports } from "@medusajs/framework/types"
import { SendgridNotificationService } from "./services/sendgrid"

const services = [SendgridNotificationService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
