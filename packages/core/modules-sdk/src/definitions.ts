import { ModuleDefinition } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  upperCaseFirst,
} from "@medusajs/utils"
import { MODULE_RESOURCE_TYPE, MODULE_SCOPE } from "./types"

export const MODULE_PACKAGE_NAMES = {
  [Modules.AUTH]: "@medusajs/medusa/auth",
  [Modules.CACHE]: "@medusajs/medusa/cache-inmemory",
  [Modules.CART]: "@medusajs/medusa/cart",
  [Modules.CUSTOMER]: "@medusajs/medusa/customer",
  [Modules.EVENT_BUS]: "@medusajs/medusa/event-bus-local",
  [Modules.INVENTORY]: "@medusajs/medusa/inventory-next", // TODO: To be replaced when current `@medusajs/inventory` is deprecated
  [Modules.LINK]: "@medusajs/medusa/link-modules",
  [Modules.PAYMENT]: "@medusajs/medusa/payment",
  [Modules.PRICING]: "@medusajs/medusa/pricing",
  [Modules.PRODUCT]: "@medusajs/medusa/product",
  [Modules.PROMOTION]: "@medusajs/medusa/promotion",
  [Modules.SALES_CHANNEL]: "@medusajs/medusa/sales-channel",
  [Modules.FULFILLMENT]: "@medusajs/medusa/fulfillment",
  [Modules.STOCK_LOCATION]: "@medusajs/medusa/stock-location-next", // TODO: To be replaced when current `@medusajs/stock-location` is deprecated
  [Modules.TAX]: "@medusajs/medusa/tax",
  [Modules.USER]: "@medusajs/medusa/user",
  [Modules.WORKFLOW_ENGINE]: "@medusajs/medusa/workflow-engine-inmemory",
  [Modules.REGION]: "@medusajs/medusa/region",
  [Modules.ORDER]: "@medusajs/medusa/order",
  [Modules.API_KEY]: "@medusajs/medusa/api-key",
  [Modules.STORE]: "@medusajs/medusa/store",
  [Modules.CURRENCY]: "@medusajs/medusa/currency",
  [Modules.FILE]: "@medusajs/medusa/file",
  [Modules.NOTIFICATION]: "@medusajs/medusa/notification",
  [Modules.INDEX]: "@medusajs/medusa/index-module",
}

export const ModulesDefinition: {
  [key: string]: ModuleDefinition
} = {
  [Modules.EVENT_BUS]: {
    key: Modules.EVENT_BUS,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
    label: upperCaseFirst(Modules.EVENT_BUS),
    isRequired: true,
    isQueryable: false,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.STOCK_LOCATION]: {
    key: Modules.STOCK_LOCATION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.STOCK_LOCATION),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.INVENTORY]: {
    key: Modules.INVENTORY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.INVENTORY),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CACHE]: {
    key: Modules.CACHE,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.CACHE],
    label: upperCaseFirst(Modules.CACHE),
    isRequired: true,
    isQueryable: false,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PRODUCT]: {
    key: Modules.PRODUCT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PRODUCT),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PRICING]: {
    key: Modules.PRICING,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PRICING),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PROMOTION]: {
    key: Modules.PROMOTION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PROMOTION),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.AUTH]: {
    key: Modules.AUTH,
    defaultPackage: false,
    label: upperCaseFirst(Modules.AUTH),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.WORKFLOW_ENGINE]: {
    key: Modules.WORKFLOW_ENGINE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.WORKFLOW_ENGINE),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    __passSharedContainer: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.SALES_CHANNEL]: {
    key: Modules.SALES_CHANNEL,
    defaultPackage: false,
    label: upperCaseFirst(Modules.SALES_CHANNEL),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.FULFILLMENT]: {
    key: Modules.FULFILLMENT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FULFILLMENT),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger", Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CART]: {
    key: Modules.CART,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CART),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CUSTOMER]: {
    key: Modules.CUSTOMER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CUSTOMER),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PAYMENT]: {
    key: Modules.PAYMENT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PAYMENT),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.USER]: {
    key: Modules.USER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.USER),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.REGION]: {
    key: Modules.REGION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.REGION),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.ORDER]: {
    key: Modules.ORDER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.ORDER),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger", Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.TAX]: {
    key: Modules.TAX,
    defaultPackage: false,
    label: upperCaseFirst(Modules.TAX),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger", Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.API_KEY]: {
    key: Modules.API_KEY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.API_KEY),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.STORE]: {
    key: Modules.STORE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.STORE),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CURRENCY]: {
    key: Modules.CURRENCY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CURRENCY),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.FILE]: {
    key: Modules.FILE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FILE),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.NOTIFICATION]: {
    key: Modules.NOTIFICATION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.NOTIFICATION),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.INDEX]: {
    key: Modules.INDEX,
    defaultPackage: false,
    label: upperCaseFirst(Modules.INDEX),
    isRequired: false,
    isQueryable: false,
    dependencies: [
      Modules.EVENT_BUS,
      "logger",
      ContainerRegistrationKeys.REMOTE_QUERY,
      ContainerRegistrationKeys.QUERY,
    ],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
