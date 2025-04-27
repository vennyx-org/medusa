/** @type {import('types').Sidebar.SidebarItem[]} */
export const integrationsSidebar = [
  {
    type: "link",
    path: "/integrations",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "Auth",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/commerce-modules/auth/auth-providers/google",
        title: "Google",
      },
      {
        type: "ref",
        path: "/commerce-modules/auth/auth-providers/github",
        title: "GitHub",
      },
    ],
  },
  {
    type: "category",
    title: "CMS",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/sanity",
        title: "Sanity",
      },
    ],
  },
  {
    type: "category",
    title: "ERP",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/recipes/erp/odoo",
        title: "Odoo",
      },
    ],
  },
  {
    type: "category",
    title: "File",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/infrastructure-modules/file/s3",
        title: "S3 (and Compatible APIs)",
      },
    ],
  },
  {
    type: "category",
    title: "Fulfillment",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/shipstation",
        title: "ShipStation",
      },
    ],
  },
  {
    type: "category",
    title: "Migration",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/magento",
        title: "Magento",
      },
    ],
  },
  {
    type: "category",
    title: "Notification",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/resend",
        title: "Resend",
      },
      {
        type: "ref",
        path: "/infrastructure-modules/notification/sendgrid",
        title: "SendGrid",
      },
    ],
  },
  {
    type: "category",
    title: "Payment",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/commerce-modules/payment/payment-provider/stripe",
        title: "Stripe",
      },
    ],
  },
  {
    type: "category",
    title: "Search",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/integrations/guides/algolia",
        title: "Algolia",
      },
    ],
  },
]
