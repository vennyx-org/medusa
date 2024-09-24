import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  pageNumberRehypePlugin,
  crossProjectLinksPlugin,
} from "remark-rehype-plugins"
import { sidebar } from "./sidebar.mjs"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "v2/resources",
            },
            "user-guide": {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "v2/user-guide",
            },
            ui: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "ui",
            },
            api: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "v2/api",
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
      [brokenLinkCheckerPlugin],
      [localLinksRehypePlugin],
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
      [rehypeSlug],
      [
        cloudinaryImgRehypePlugin,
        {
          cloudinaryConfig: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
            flags: ["fl_lossy", "f_auto"],
            resize: {
              action: "pad",
              aspectRatio: "16:9",
            },
            roundCorners: 16,
          },
        },
      ],
      [
        pageNumberRehypePlugin,
        {
          sidebar: sidebar,
        },
      ],
    ],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/v2/resources",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/v2/resources`,
          basePath: false,
        },
        {
          source: "/v2/resources/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/v2/resources/:path*`,
          basePath: false,
        },
        {
          source: "/v2/api/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL || "https://localhost:3001"
          }/v2/api/:path*`,
          basePath: false,
        },
        // TODO comment out once we have the user guide published
        // {
        //   source: "/user-guide",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide`,
        //   basePath: false,
        // },
        // {
        //   source: "/user-guide/:path*",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide/:path*`,
        //   basePath: false,
        // },
        {
          source: "/:path((?!v2).*)",
          destination: `${
            process.env.NEXT_PUBLIC_API_V1_URL || "https://localhost:3001"
          }/:path*`,
          basePath: false,
        },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: "/advanced-development/modules/remote-query",
        destination: "/advanced-development/modules/query",
        permanent: true,
      },
      {
        source: "/cheatsheet",
        destination: "/more-resources/cheatsheet",
        permanent: true,
      },
    ]
  },
}

export default withMDX(nextConfig)
