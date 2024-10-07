import { ModuleProviderExports } from "@medusajs/framework/types"
import {
  StripeBancontactService,
  StripeBlikService,
  StripeGiropayService,
  StripeIdealService,
  StripeProviderService,
  StripePrzelewy24Service,
} from "./services"

const services = [
  StripeBancontactService,
  StripeBlikService,
  StripeGiropayService,
  StripeIdealService,
  StripeProviderService,
  StripePrzelewy24Service,
]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
