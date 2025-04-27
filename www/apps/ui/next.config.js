const { withContentlayer } = require("next-contentlayer")

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": [
      "./src/content/docs/**/*.mdx", 
      "./specs/**/*", 
      "./examples/**/*"
    ],
  },
}

module.exports = withContentlayer(nextConfig)
