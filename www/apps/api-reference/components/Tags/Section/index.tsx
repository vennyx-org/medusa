"use client"

import getSectionId from "@/utils/get-section-id"
import { useInView } from "react-intersection-observer"
import { useEffect, useMemo, useState } from "react"
import {
  isElmWindow,
  swrFetcher,
  useScrollController,
  useSidebar,
} from "docs-ui"
import dynamic from "next/dynamic"
import type { SectionProps } from "../../Section"
import type { MDXContentClientProps } from "../../MDXContent/Client"
import TagPaths from "../Paths"
import DividedLayout from "@/layouts/Divided"
import LoadingProvider from "@/providers/loading"
import SectionContainer from "../../Section/Container"
import { useArea } from "@/providers/area"
import SectionDivider from "../../Section/Divider"
import clsx from "clsx"
import { Feedback, Loading, Link } from "docs-ui"
import { usePathname, useRouter } from "next/navigation"
import formatReportLink from "@/utils/format-report-link"
import { SchemaObject, TagObject } from "@/types/openapi"
import useSWR from "swr"
import { TagSectionSchemaProps } from "./Schema"
import basePathUrl from "../../../utils/base-path-url"
import checkElementInViewport from "../../../utils/check-element-in-viewport"

export type TagSectionProps = {
  tag: TagObject
} & React.HTMLAttributes<HTMLDivElement>

const Section = dynamic<SectionProps>(
  async () => import("../../Section")
) as React.FC<SectionProps>

const TagSectionSchema = dynamic<TagSectionSchemaProps>(
  async () => import("./Schema")
) as React.FC<TagSectionSchemaProps>

const MDXContentClient = dynamic<MDXContentClientProps>(
  async () => import("../../MDXContent/Client"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentClientProps>

const TagSection = ({ tag }: TagSectionProps) => {
  const { activePath, setActivePath } = useSidebar()
  const router = useRouter()
  const [loadPaths, setLoadPaths] = useState(false)
  const slugTagName = useMemo(() => getSectionId([tag.name]), [tag])
  const { area } = useArea()
  const pathname = usePathname()
  const { scrollableElement, scrollToTop } = useScrollController()
  const { data } = useSWR<{
    schema: SchemaObject
  }>(
    tag["x-associatedSchema"]
      ? basePathUrl(
          `/api/schema?name=${tag["x-associatedSchema"].$ref}&area=${area}`
        )
      : null,
    swrFetcher,
    {
      errorRetryInterval: 2000,
    }
  )
  const associatedSchema = data?.schema

  const root = useMemo(() => {
    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [scrollableElement])
  const { ref } = useInView({
    threshold: 0.5,
    rootMargin: `112px 0px 112px 0px`,
    root,
    onChange: (inView) => {
      if (inView && !loadPaths) {
        setLoadPaths(true)
      }
      if (inView) {
        // ensure that the hash link doesn't change if it links to an inner path
        const currentHashArr = location.hash.replace("#", "").split("_")
        if (currentHashArr.length < 2 || currentHashArr[0] !== slugTagName) {
          if (location.hash !== slugTagName) {
            router.push(`#${slugTagName}`, {
              scroll: false,
            })
          }
          if (activePath !== slugTagName) {
            setActivePath(slugTagName)
          }
        }
      }
    },
  })

  useEffect(() => {
    if (activePath && activePath.includes(slugTagName)) {
      const tagName = activePath.split("_")
      if (tagName.length === 1 && tagName[0] === slugTagName) {
        const elm = document.getElementById(tagName[0])
        if (elm && !checkElementInViewport(elm, 0)) {
          scrollToTop(
            elm.offsetTop + (elm.offsetParent as HTMLElement)?.offsetTop,
            0
          )
        }
      } else if (tagName.length > 1 && tagName[0] === slugTagName) {
        setLoadPaths(true)
      }
    }
  }, [slugTagName, activePath])

  return (
    <div
      className={clsx("min-h-screen", !loadPaths && "relative")}
      id={slugTagName}
    >
      <DividedLayout
        ref={ref}
        mainContent={
          <SectionContainer>
            <h2>{tag.name}</h2>
            {tag.description && (
              <Section>
                <MDXContentClient
                  content={tag.description}
                  scope={{
                    addToSidebar: false,
                  }}
                />
              </Section>
            )}
            {tag.externalDocs && (
              <p className="mt-1">
                <span className="text-medium-plus">Related guide:</span>{" "}
                <Link href={tag.externalDocs.url} target="_blank">
                  {tag.externalDocs.description || "Read More"}
                </Link>
              </p>
            )}
            <Feedback
              event="survey_api-ref"
              extraData={{
                area,
                section: tag.name,
              }}
              pathName={pathname}
              reportLink={formatReportLink(area, tag.name)}
              vertical
              question="Was this section helpful?"
            />
          </SectionContainer>
        }
        codeContent={<></>}
      />
      {associatedSchema && (
        <TagSectionSchema schema={associatedSchema} tagName={tag.name} />
      )}
      {loadPaths && (
        <LoadingProvider initialLoading={true}>
          <TagPaths tag={tag} />
        </LoadingProvider>
      )}
      {!loadPaths && <SectionDivider />}
    </div>
  )
}

export default TagSection
