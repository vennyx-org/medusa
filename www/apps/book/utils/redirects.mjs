/**
 * @returns {Promise<import("next").Redirect[]>}
 */
const redirects = async () => {
  return [
    {
      source: "/v2/:path*",
      destination: "/:path*",
      permanent: true,
    },
    {
      source: "/recipes/:path*",
      destination: "/resources/recipes",
      permanent: true,
    },
    {
      source: "/plugins/:path*",
      destination: "/v1/plugins/:path*",
      permanent: true,
    },
    {
      source: "/medusa-react/:path*",
      destination: "/v1/medusa-react/:path*",
      permanent: true,
    },
    {
      source: "/learn/customization/extend-models/:path*",
      destination: "/learn/customization/extend-features/:path*",
      permanent: true,
    },
    {
      source: "/learn/advanced-development/architecture/overview",
      destination: "/learn/introduction/architecture",
      permanent: true,
    },
    {
      source: "/learn/first-customizations",
      destination: "/learn/customization",
      permanent: true,
    },
    {
      source: "/learn/basics/medusa-container",
      destination: "/learn/fundamentals/medusa-container",
      permanent: true,
    },
    {
      source: "/learn/basics/modules",
      destination: "/learn/fundamentals/modules",
      permanent: true,
    },
    {
      source: "/learn/basics/modules-directory-structure",
      destination: "/learn/fundamentals/modules/modules-directory-structure",
      permanent: true,
    },
    {
      source: "/learn/basics/loaders",
      destination: "/learn/fundamentals/modules/loaders",
      permanent: true,
    },
    {
      source: "/learn/basics/commerce-modules",
      destination: "/learn/fundamentals/modules/commerce-modules",
      permanent: true,
    },
    {
      source: "/learn/advanced-development/architecture/infrastructure-modules",
      destination: "/learn/fundamentals/modules/infrastructure-modules",
      permanent: true,
    },
    {
      source: "/learn/basics/api-routes",
      destination: "/learn/fundamentals/api-routes",
      permanent: true,
    },
    {
      source: "/learn/basics/workflows",
      destination: "/learn/fundamentals/workflows",
      permanent: true,
    },
    {
      source: "/learn/basics/events-and-subscribers",
      destination: "/learn/fundamentals/events-and-subscribers",
      permanent: true,
    },
    {
      source: "/learn/basics/scheduled-jobs",
      destination: "/learn/fundamentals/scheduled-jobs",
      permanent: true,
    },
    {
      source: "/learn/basics/project-directories-files",
      destination: "/learn/installation#project-files",
      permanent: true,
    },
    {
      source: "/learn/basics/admin-customizations",
      destination: "/learn/fundamentals/admin/widgets",
      permanent: true,
    },
    {
      source: "/learn/advanced-development/:path*",
      destination: "/learn/fundamentals/:path*",
      permanent: true,
    },
    {
      source: "/learn/storefront-development/nextjs-starter",
      destination: "/resources/nextjs-starter",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/module-links/remote-link",
      destination: "/learn/fundamentals/module-links/link",
      permanent: true,
    },
    {
      source: "/learn/debugging-and-testing",
      destination: "/learn/debugging-and-testing/testing-tools",
      permanent: true,
    },
    {
      source: "/learn/more-resources",
      destination: "/learn/resources/contribution-guidelines/docs",
      permanent: true,
    },
    {
      source: "/learn/conventions/:path*",
      destination: "/learn/configurations/:path*",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/data-models/configure-properties",
      destination: "/learn/fundamentals/data-models/properties",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/data-models/default-properties",
      destination: "/learn/fundamentals/data-models/properties",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/data-models/primary-key",
      destination: "/learn/fundamentals/data-models/properties",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/data-models/property-types",
      destination: "/learn/fundamentals/data-models/properties",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/data-models/searchable-property",
      destination: "/learn/fundamentals/data-models/properties",
      permanent: true,
    },
    {
      source: "/starters/nextjs-medusa-starter",
      destination: "/resources/nextjs-starter",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/modules/infrastructure-modules",
      destination: "/learn/fundamentals/modules/infrastructure-modules",
      permanent: true,
    },
    {
      source: "/v1/admin/quickstart",
      destination: "/learn/fundamentals/admin",
      permanent: true,
    },
    {
      source: "/v1/development/entities/migrations/overview",
      destination: "/learn/fundamentals/data-models/write-migration",
      permanent: true,
    },
    {
      source: "/v1/plugins/payment/stripe",
      destination:
        "/resources/commerce-modules/payment/payment-provider/stripe",
      permanent: true,
    },
    {
      source: "/v1/plugins/notifications/sendgrid",
      destination: "/resources/infrastructure-modules/notification/sendgrid",
      permanent: true,
    },
    {
      source: "/v1/plugins/file-service/local",
      destination: "/resources/infrastructure-modules/file/local",
      permanent: true,
    },
    {
      source: "/v1/modules/users/admin/manage-users",
      destination: "/resources/commerce-modules/user/user-creation-flows",
      permanent: true,
    },
    {
      source: "/v1/modules/products/admin/import-products",
      destination: "/user-guide/products/import",
      permanent: true,
    },
    {
      source: "/v1/deployments/server/general-guide",
      destination: "/learn/deployment/general",
      permanent: true,
    },
    {
      source: "/v1/user-guide/products/manage",
      destination: "/user-guide/products/edit",
      permanent: true,
    },
    {
      source: "/v1/plugins/payment",
      destination: "/resources/integrations",
      permanent: true,
    },
    {
      source: "/v1/development/cache/modules/redis",
      destination: "/resources/infrastructure-modules/cache/redis",
      permanent: true,
    },
    {
      source: "/v1/development/plugins/create",
      destination: "/learn/fundamentals/plugins/create",
      permanent: true,
    },
    {
      source: "/v1/cli/reference",
      destination: "/resources/medusa-cli",
      permanent: true,
    },
    {
      source: "/v1/modules/discounts",
      destination: "/resources/commerce-modules/promotion",
      permanent: true,
    },
    {
      source: "/v1/deployments/server/deploying-on-digital-ocean",
      destination: "/resources/deployment",
      permanent: true,
    },
    {
      source: "/v1/upgrade-guides",
      destination: "/learn/update",
      permanent: true,
    },
    {
      source: "/v1/starters/nextjs-medusa-starter",
      destination: "/resources/nextjs-starter",
      permanent: true,
    },
    {
      source: "/v1/development/entities/extend-entity",
      destination: "/learn/customization/extend-features",
      permanent: true,
    },
    {
      source: "/v1/development/fundamentals/architecture-overview",
      destination: "/learn/introduction/architecture",
      permanent: true,
    },
    {
      source: "/v1/development/fundamentals/local-development",
      destination: "/learn/installation",
      permanent: true,
    },
    {
      source: "/v1/modules/products/admin/manage-products",
      destination: "/user-guides/products/edit",
      permanent: true,
    },
    {
      source: "/v1/plugins/overview",
      destination: "/learn/integrations",
      permanent: true,
    },
    {
      source: "/v1/modules/carts-and-checkout/shipping",
      destination: "/resources/commerce-modules/fulfillment",
      permanent: true,
    },
    {
      source: "/v1/development/events/events-list",
      destination: "/resources/events-reference",
      permanent: true,
    },
    {
      source: "/v1/development/feature-flags/overview",
      destination: "/learn/configurations/medusa-config",
      permanent: true,
    },
    {
      source: "/v1/modules/orders/overview",
      destination: "/resources/commerce-modules/order",
      permanent: true,
    },
    {
      source: "/v1/modules/orders",
      destination: "/resources/commerce-modules/order",
      permanent: true,
    },
    {
      source: "/v1/modules/customers/overview",
      destination: "/resources/commerce-modules/customer",
      permanent: true,
    },
    {
      source: "/v1/modules/sales-channels",
      destination: "/resources/commerce-modules/sales-channel",
      permanent: true,
    },
    {
      source: "/v1/plugins/search/algolia",
      destination: "/resources/integrations/guides/algolia",
      permanent: true,
    },
    {
      source: "/v1/modules/customers/admin/manage-customers",
      destination: "/user-guide/customers/manage",
      permanent: true,
    },
    {
      source: "/v1/modules/users/admin/manage-profile",
      destination: "/user-guides/settings/profile",
      permanent: true,
    },
    {
      source: "/v1/modules/customers/customer-groups",
      destination: "/commerce-modules/customer",
      permanent: true,
    },
    {
      source: "/v1/modules/taxes/admin/manage-tax-rates",
      destination: "/user-guide/settings/tax-regions",
      permanent: true,
    },
    {
      source: "/v1/modules/users/admin/manage-invites",
      destination: "/user-guide/settings/users/invites",
      permanent: true,
    },
    {
      source: "/v1/user-guide/orders/fulfillments",
      destination: "/user-guide/orders/fulfillments",
      permanent: true,
    },
    {
      source: "/v1/modules/multiwarehouse/admin/manage-inventory-items",
      destination: "/user-guide/inventory/inventory",
      permanent: true,
    },
    {
      source: "/v1/user-guide/settings/publishable-api-keys",
      destination: "/user-guide/settings/developer/publishable-api-keys",
      permanent: true,
    },
    {
      source: "/v1/modules/multiwarehouse/admin/manage-reservations",
      destination: "/user-guide/inventory/reservations",
      permanent: true,
    },
    {
      source: "/v1/user-guide/multiwarehouse/locations",
      destination: "/user-guide/settings/locations-and-shipping/locations",
      permanent: true,
    },
    {
      source: "/learn/fundamentals/workflows/access-workflow-errors",
      destination: "/learn/fundamentals/workflows/errors",
      permanent: true,
    },
  ]
}

export default redirects
