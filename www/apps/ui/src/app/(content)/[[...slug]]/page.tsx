import { Text } from "@medusajs/ui"
import { allDocs } from "contentlayer/generated"
import { notFound } from "next/navigation"

import { Mdx } from "@/components/mdx-components"
import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { H1 } from "docs-ui"

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getDocFromParams(props: DocPageProps) {
  const params = await props.params
  const slug = params.slug?.join("/") || ""

  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return
  }

  return doc
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(props)

  if (!doc) {
    return {}
  }

  const title = `${doc.title} - ${siteConfig.name}`

  return {
    title: title,
    description: doc.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
  }
}

export async function generateStaticParams() {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }))
}

export default async function DocPage(props: DocPageProps) {
  const doc = await getDocFromParams(props)

  if (!doc) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <H1>{doc.title}</H1>
      <Text className="text-medusa-fg-subtle mb-6" size="large">
        {doc.description}
      </Text>
      <div>
        <Mdx code={doc.body.code} />
      </div>
    </div>
  )
}
