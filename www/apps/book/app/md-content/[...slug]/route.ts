import { getCleanMd } from "docs-utils"
import { existsSync } from "fs"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import {
  addUrlToRelativeLink,
  crossProjectLinksPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"
import type { Plugin } from "unified"

type Params = {
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params

  // keep this so that Vercel keeps the files in deployment
  const basePath = path.join(process.cwd(), "app")
  const filePath = path.join(basePath, ...slug, "page.mdx")

  if (!existsSync(filePath)) {
    return notFound()
  }

  const cleanMdContent = await getCleanMd_(filePath, {
    before: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            "user-guide": {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            ui: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            api: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
      [localLinksRehypePlugin],
    ] as unknown as Plugin[],
    after: [
      [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
    ] as unknown as Plugin[],
  })

  return new NextResponse(cleanMdContent, {
    headers: {
      "Content-Type": "text/markdown",
    },
    status: 200,
  })
}

const getCleanMd_ = unstable_cache(
  async (filePath: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
    getCleanMd({ file: filePath, plugins }),
  ["clean-md"],
  {
    revalidate: 3600,
  }
)
