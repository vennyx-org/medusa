import { OptionType } from "@/hooks"
import { NavigationItem } from "types"

export const GITHUB_ISSUES_LINK =
  "https://github.com/medusajs/medusa/issues/new/choose"

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    link: `/learn`,
    title: "Get Started",
    project: "book",
  },
  {
    type: "dropdown",
    title: "Product",
    children: [
      {
        type: "sub-menu",
        title: "Framework",
        link: "/learn/fundamentals/framework",
        items: [
          {
            type: "link",
            title: "API Routes",
            link: "/learn/fundamentals/api-routes",
          },
          {
            type: "link",
            title: "Data Models",
            link: "/learn/fundamentals/data-models",
          },
          {
            type: "link",
            title: "Events and Subscribers",
            link: "/learn/fundamentals/events-and-subscribers",
          },
          {
            type: "link",
            title: "Medusa Container",
            link: "/learn/fundamentals/medusa-container",
          },
          {
            type: "link",
            title: "Modules",
            link: "/learn/fundamentals/modules",
          },
          {
            type: "link",
            title: "Module Links",
            link: "/learn/fundamentals/module-links",
          },
          {
            type: "link",
            title: "Plugins",
            link: "/learn/fundamentals/plugins",
          },
          {
            type: "link",
            title: "Query",
            link: "/learn/fundamentals/module-links/query",
          },
          {
            type: "link",
            title: "Scheduled Jobs",
            link: "/learn/fundamentals/scheduled-jobs",
          },
          {
            type: "link",
            title: "Workflows",
            link: "/learn/fundamentals/workflows",
          },
        ],
      },
      {
        type: "sub-menu",
        title: "Commerce Modules",
        link: "/resources/commerce-modules",
        items: [
          {
            type: "link",
            title: "API Key",
            link: "/resources/commerce-modules/api-key",
          },
          {
            type: "link",
            title: "Auth",
            link: "/resources/commerce-modules/auth",
          },
          {
            type: "link",
            title: "Cart",
            link: "/resources/commerce-modules/cart",
          },
          {
            type: "link",
            title: "Currency",
            link: "/resources/commerce-modules/currency",
          },
          {
            type: "link",
            title: "Customer",
            link: "/resources/commerce-modules/customer",
          },
          {
            type: "link",
            title: "Fulfillment",
            link: "/resources/commerce-modules/fulfillment",
          },
          {
            type: "link",
            title: "Inventory",
            link: "/resources/commerce-modules/inventory",
          },
          {
            type: "link",
            title: "Order",
            link: "/resources/commerce-modules/order",
          },
          {
            type: "link",
            title: "Payment",
            link: "/resources/commerce-modules/payment",
          },
          {
            type: "link",
            title: "Pricing",
            link: "/resources/commerce-modules/pricing",
          },
          {
            type: "link",
            title: "Product",
            link: "/resources/commerce-modules/product",
          },
          {
            type: "link",
            title: "Promotion",
            link: "/resources/commerce-modules/promotion",
          },
          {
            type: "link",
            title: "Region",
            link: "/resources/commerce-modules/region",
          },
          {
            type: "link",
            title: "Sales Channel",
            link: "/resources/commerce-modules/sales-channel",
          },
          {
            type: "link",
            title: "Stock Location",
            link: "/resources/commerce-modules/stock-location",
          },
          {
            type: "link",
            title: "Store",
            link: "/resources/commerce-modules/store",
          },
          {
            type: "link",
            title: "Tax",
            link: "/resources/commerce-modules/tax",
          },
          {
            type: "link",
            title: "User",
            link: "/resources/commerce-modules/user",
          },
        ],
      },
      {
        type: "sub-menu",
        title: "Infrastructure Modules",
        link: "/resources/infrastructure-modules",
        items: [
          {
            type: "link",
            title: "Cache",
            link: "/resources/infrastructure-modules/cache",
          },
          {
            type: "link",
            title: "Event",
            link: "/resources/infrastructure-modules/event",
          },
          {
            type: "link",
            title: "File",
            link: "/resources/infrastructure-modules/file",
          },
          {
            type: "link",
            title: "Locking",
            link: "/resources/infrastructure-modules/locking",
          },
          {
            type: "link",
            title: "Notification",
            link: "/resources/infrastructure-modules/notification",
          },
          {
            type: "link",
            title: "Workflow Engine",
            link: "/resources/infrastructure-modules/workflow-engine",
          },
        ],
      },
    ],
  },
  {
    type: "dropdown",
    title: "Build",
    project: "resources",
    children: [
      {
        type: "link",
        title: "Recipes",
        link: "/resources/recipes",
      },
      {
        type: "link",
        title: "How-to & Tutorials",
        link: "/resources/how-to-tutorials",
      },
      {
        type: "link",
        title: "Integrations",
        link: "/resources/integrations",
      },
      {
        type: "link",
        title: "Storefront",
        link: "/resources/storefront-development",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Tools",
    link: "/resources/tools",
    project: "resources",
    children: [
      {
        type: "sub-menu",
        title: "CLI Tools",
        items: [
          {
            type: "link",
            title: "create-medusa-app",
            link: "/resources/create-medusa-app",
          },
          {
            type: "link",
            title: "Medusa CLI",
            link: "/resources/medusa-cli",
          },
        ],
      },
      {
        type: "link",
        title: "JS SDK",
        link: "/resources/js-sdk",
      },
      {
        type: "link",
        title: "Next.js Starter",
        link: "/resources/nextjs-starter",
      },
      {
        type: "link",
        title: "Medusa UI",
        link: "/ui",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Reference",
    project: "resources",
    link: "/resources/references-overview",
    children: [
      {
        type: "link",
        title: "Admin API",
        link: "/api/admin",
      },
      {
        type: "link",
        title: "Store API",
        link: "/api/store",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Admin Injection Zones",
        link: "/resources/admin-widget-injection-zones",
      },
      {
        type: "link",
        title: "Container Resources",
        link: "/resources/medusa-container-resources",
      },
      {
        type: "link",
        title: "Core Workflows",
        link: "/resources/medusa-workflows-reference",
      },
      {
        type: "link",
        title: "Data Model Language",
        link: "/resources/references/data-model",
      },
      {
        type: "link",
        title: "Data Model Repository",
        link: "/resources/data-model-repository-reference",
      },
      {
        type: "link",
        title: "Events Reference",
        link: "/resources/events-reference",
      },
      {
        type: "link",
        title: "Helper Steps",
        link: "/resources/references/helper-steps",
      },
      {
        type: "link",
        title: "Service Factory",
        link: "/resources/service-factory-reference",
      },
      {
        type: "link",
        title: "Testing Framework",
        link: "/resources/test-tools-reference",
      },
      {
        type: "link",
        title: "Workflows SDK",
        link: "/resources/references/workflows",
      },
    ],
  },
  {
    type: "link",
    title: "User Guide",
    link: "/user-guide",
  },
]

export const searchFilters: OptionType[] = [
  {
    value: "concepts-guides",
    label: "Concepts & Guides",
    hitsPerPage: 8,
  },
  {
    value: "references",
    label: "References",
  },
  {
    value: "admin-v2",
    label: "Admin API",
  },
  {
    value: "store-v2",
    label: "Store API",
  },
  {
    value: "user-guide",
    label: "User Guide",
  },
  {
    value: "troubleshooting",
    label: "Troubleshooting",
  },
]
