/** @type {import('types').Sidebar.SidebarItem[]} */
export const howToTutorialsSidebar = [
  {
    type: "link",
    path: "/how-to-tutorials",
    title: "Overview",
  },
  {
    type: "link",
    path: "/examples",
    title: "Example Snippets",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "How-To Guides",
    description:
      "How-to guides are a collection of guides that help you understand how to achieve certain customizations or implementing specific features in Medusa.",
    children: [
      {
        type: "sub-category",
        title: "Server",
        autogenerate_tags: "howTo+server",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "These how-to guides help you customize the Medusa server to implement custom features and business logic.",
      },
      {
        type: "sub-category",
        title: "Admin",
        autogenerate_tags: "howTo+admin",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        children: [
          {
            type: "sidebar",
            sidebar_id: "admin-components-layouts",
            title: "Components & Layouts",
            children: [
              {
                type: "link",
                path: "/admin-components",
                title: "Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Layouts",
                autogenerate_path: "/admin-components/layouts",
              },
              {
                type: "category",
                title: "Components",
                autogenerate_path: "/admin-components/components",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Tutorials",
    description: `Tutorials are step-by-step guides that take you through implementing a specific use case in Medusa. You can follow these guides whether you're a beginner or an experienced Medusa developer.

While tutorials show you a specific use case, they also help you understand how to implement similar use cases in your own projects. Also, you can implement the use case in a tutorial differently to fit your business requirements.`,
    children: [
      {
        type: "link",
        title: "Abandoned Cart",
        path: "/how-to-tutorials/tutorials/abandoned-cart",
        description:
          "Learn how to send abandoned cart notifications to customers.",
      },
      {
        type: "link",
        title: "Custom Item Pricing",
        path: "/examples/guides/custom-item-price",
        description:
          "Learn how to use prices from external systems for products.",
      },
      {
        type: "link",
        title: "Loyalty Points System",
        path: "/how-to-tutorials/tutorials/loyalty-points",
        description:
          "Learn how to implement a loyalty points system in your Medusa store.",
      },
      {
        type: "ref",
        title: "Magento Migration",
        path: "/integrations/guides/magento",
        description: "Learn how to migrate data from Magento to Medusa.",
      },
      {
        type: "link",
        title: "Product Reviews",
        path: "/how-to-tutorials/tutorials/product-reviews",
        description:
          "Learn how to implement product reviews in your Medusa store.",
      },
      {
        type: "link",
        title: "Quote Management",
        path: "/examples/guides/quote-management",
        description:
          "Learn how to implement quote management, useful for B2B use cases.",
      },
      {
        type: "link",
        title: "Wishlist Plugin",
        path: "/plugins/guides/wishlist",
        description:
          "Learn how to build a plugin for wishlist functionalities.",
      },
      {
        type: "sub-category",
        title: "Extend Modules",
        autogenerate_tags: "tutorial+extendModule",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
      },
    ],
  },
  {
    type: "category",
    title: "Deployment",
    children: [
      {
        type: "link",
        path: "/deployment",
        title: "Overview",
      },
      {
        type: "link",
        title: "Medusa Cloud",
        path: "https://medusajs.com/pricing",
      },
      {
        type: "sub-category",
        title: "Self-Hosting",
        children: [
          {
            type: "link",
            path: "https://docs.medusajs.com/learn/deployment/general",
            title: "General",
          },
          {
            type: "link",
            path: "/deployment/medusa-application/railway",
            title: "Railway",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Next.js Starter",
        autogenerate_path: "/deployment/storefront",
      },
    ],
  },
]
