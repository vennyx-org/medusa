import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  prerequisitesLinkFixerPlugin,
  typeListLinkFixerPlugin,
  workflowDiagramLinkFixerPlugin,
} from "remark-rehype-plugins"

import bundleAnalyzer from "@next/bundle-analyzer"
import mdx from "@next/mdx"
import mdxPluginOptions from "./mdx-options.mjs"
import path from "node:path"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        brokenLinkCheckerPlugin,
        {
          crossProjects: {
            docs: {
              projectPath: path.resolve("..", "book"),
            },
            ui: {
              projectPath: path.resolve("..", "ui"),
              contentPath: "src/content/docs",
            },
            "user-guide": {
              projectPath: path.resolve("..", "user-guide"),
            },
          },
        },
      ],
      ...mdxPluginOptions.options.rehypePlugins,
      [localLinksRehypePlugin],
      [typeListLinkFixerPlugin],
      [
        workflowDiagramLinkFixerPlugin,
        {
          checkLinksType: "value",
        },
      ],
      [
        prerequisitesLinkFixerPlugin,
        {
          checkLinksType: "value",
        },
      ],
    ],
    remarkPlugins: mdxPluginOptions.options.remarkPlugins,
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui", "next-mdx-remote"],

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/resources",
  async redirects() {
    return [
      {
        source: "/commerce-modules/order/relations-to-other-modules",
        destination: "/commerce-modules/order/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/payment/relations-to-other-modules",
        destination: "/commerce-modules/payment/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/api-key/relations-to-other-modules",
        destination: "/commerce-modules/api-key/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/cart/relations-to-other-modules",
        destination: "/commerce-modules/cart/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/fulfillment/relations-to-other-modules",
        destination: "/commerce-modules/fulfillment/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/inventory/relations-to-other-modules",
        destination: "/commerce-modules/inventory/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/region/relations-to-other-modules",
        destination: "/commerce-modules/region/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/sales-channel/relations-to-other-modules",
        destination: "/commerce-modules/sales-channel/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/stock-location/relations-to-other-modules",
        destination: "/commerce-modules/stock-location/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/pricing/relations-to-other-modules",
        destination: "/commerce-modules/pricing/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/product/relations-to-other-modules",
        destination: "/commerce-modules/product/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/promotion/relations-to-other-modules",
        destination: "/commerce-modules/promotion/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/deployment/admin/vercel",
        destination: "/deployment",
        permanent: true,
      },
      {
        source: "/recipes/integrate-ecommerce-stack",
        destination: "/recipes/erp",
        permanent: true,
      },
      {
        source: "/contribution-guidelines/:path",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/resources/contribution-guidelines/:path`,
        permanent: true,
      },
      {
        source: "/usage",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/resources/usage`,
        permanent: true,
      },
      {
        source: "/plugins",
        destination: "/integrations",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/recipes",
        permanent: true,
      },
      {
        source: "/references/medusa-config",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/configurations/medusa-config`,
        permanent: true,
      },
      {
        source: "/troubleshooting/workflow-errors",
        destination: "/troubleshooting/workflow-errors/when-then",
        permanent: true,
      },
      {
        source: "/medusa-cli/commands/start-cluster",
        destination: "/medusa-cli/commands/start",
        permanent: true,
      },
      {
        source: "/architectural-modules/:path*",
        destination: "/infrastructure-modules/:path*",
        permanent: true,
      },
    ]
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/@medusajs/icons"],
  },
  outputFileTracingIncludes: {
    "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
    "/md\\-content/references/**": ["./references/**/*.mdx"],
  },
  experimental: {
    optimizePackageImports: ["@medusajs/icons", "@medusajs/ui", "elkjs"],
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withMDX(withBundleAnalyzer(nextConfig))
