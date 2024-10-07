import { ModuleProviderExports } from "@medusajs/framework/types"
import { GoogleAuthService } from "./services/google"

const services = [GoogleAuthService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
