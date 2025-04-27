import mdx from "@next/mdx"
import path from "path"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import remarkDirective from "remark-directive"
import remarkFrontmatter from "remark-frontmatter"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  resolveAdmonitionsPlugin,
  crossProjectLinksPlugin,
  prerequisitesLinkFixerPlugin,
} from "remark-rehype-plugins"
import bundleAnalyzer from "@next/bundle-analyzer"

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
            resources: {
              projectPath: path.resolve("..", "resources"),
              hasGeneratedSlugs: true,
            },
          },
        },
      ],
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            docs: {
              url: process.env.NEXT_PUBLIC_DOCS_URL,
              path: "",
            },
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            ui: {
              url: process.env.NEXT_PUBLIC_UI_URL,
            },
            api: {
              url: process.env.NEXT_PUBLIC_API_URL,
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
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
        prerequisitesLinkFixerPlugin,
        {
          checkLinksType: "value",
        },
      ],
    ],
    remarkPlugins: [
      [remarkFrontmatter],
      [remarkDirective],
      [resolveAdmonitionsPlugin],
    ],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/user-guide",
  outputFileTracingIncludes: {
    "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/@medusajs/icons"],
  },
  experimental: {
    optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withMDX(withBundleAnalyzer(nextConfig))
