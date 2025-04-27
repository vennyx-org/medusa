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
import { filesMap } from "../../../generated/files-map.mjs"
import { slugChanges } from "../../../generated/slug-changes.mjs"

type Params = {
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug = ["/"] } = await params

  // keep this so that Vercel keeps the files in deployment
  path.join(process.cwd(), "app")
  path.join(process.cwd(), "references")

  const filePathFromMap = await getFileFromMaps(
    `/${slug.join("/")}`.replace("//", "/")
  )
  if (!filePathFromMap) {
    return notFound()
  }

  const filePath = path.join(process.cwd(), "..", "..", "..", filePathFromMap)

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
            docs: {
              url: process.env.NEXT_PUBLIC_DOCS_URL,
              path: "",
            },
            "user-guide": {
              url: process.env.NEXT_PUBLIC_USER_GUIDE_URL,
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

const getFileFromMaps = unstable_cache(
  async (path: string) => {
    return (
      slugChanges.find((slugChange) => slugChange.newSlug === path)?.filePath ||
      filesMap.find((file) => file.pathname === path)?.filePath
    )
  },
  ["file-map"],
  {
    revalidate: 3600,
  }
)
