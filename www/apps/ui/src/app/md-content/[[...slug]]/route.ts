import { getCleanMd } from "docs-utils"
import { existsSync } from "fs"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { addUrlToRelativeLink } from "remark-rehype-plugins"
import type { Plugin } from "unified"
import * as Icons from "@medusajs/icons"
import * as HookValues from "@/registries/hook-values"
import { colors as allColors } from "@/config/colors"

type Params = {
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug = ["/"] } = await params

  // keep this so that Vercel keeps the files in deployment
  const basePath = path.join(process.cwd(), "src", "content", "docs")
  const examplesPath = path.join(process.cwd(), "src", "examples")
  const specsPath = path.join(process.cwd(), "src", "specs")
  const fileName = slug.length === 1 ? "index" : slug.pop() || "index"

  const filePath = path.join(basePath, ...slug, `${fileName}.mdx`)

  if (!existsSync(filePath)) {
    return notFound()
  }

  const cleanMdContent = await getCleanMd_(
    filePath,
    { examplesPath, specsPath },
    {
      after: [
        [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
      ] as unknown as Plugin[],
    }
  )

  return new NextResponse(cleanMdContent, {
    headers: {
      "Content-Type": "text/markdown",
    },
    status: 200,
  })
}

const getCleanMd_ = unstable_cache(
  async (
    filePath: string,
    parserOptions: {
      examplesPath: string
      specsPath: string
    },
    plugins?: { before?: Plugin[]; after?: Plugin[] }
  ) => {
    const iconNames = Object.keys(Icons).filter((name) => name !== "default")

    return getCleanMd({
      file: filePath,
      plugins,
      parserOptions: {
        ComponentExample: {
          examplesBasePath: parserOptions.examplesPath,
        },
        ComponentReference: {
          specsPath: parserOptions.specsPath,
        },
        IconSearch: {
          iconNames,
        },
        HookValues: {
          hooksData: HookValues,
        },
        Colors: {
          colors: allColors,
        },
      },
    })
  },
  ["clean-md"],
  {
    revalidate: 3600,
  }
)
