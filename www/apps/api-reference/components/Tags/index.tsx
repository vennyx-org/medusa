"use client"

import type { OpenAPIV3 } from "openapi-types"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { useBaseSpecs } from "@/providers/base-specs"
import dynamic from "next/dynamic"
import type { TagSectionProps } from "./Section"
import { useArea } from "@/providers/area"
import { swrFetcher, useSidebar } from "docs-ui"
import getSectionId from "@/utils/get-section-id"
import { ExpandedDocument } from "@/types/openapi"
import getTagChildSidebarItems from "@/utils/get-tag-child-sidebar-items"
import { SidebarItem, SidebarItemSections } from "types"
import basePathUrl from "../../utils/base-path-url"
import { useRouter } from "next/navigation"

const TagSection = dynamic<TagSectionProps>(
  async () => import("./Section")
) as React.FC<TagSectionProps>

export type TagsProps = React.HTMLAttributes<HTMLDivElement>

function getCurrentTag() {
  return typeof location !== "undefined"
    ? location.hash.replace("#", "").split("_")[0]
    : ""
}

const Tags = () => {
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([])
  const [loadData, setLoadData] = useState<boolean>(false)
  const [expand, setExpand] = useState<string>("")
  const { baseSpecs, setBaseSpecs } = useBaseSpecs()
  const { activePath, addItems, setActivePath } = useSidebar()
  const { area, prevArea } = useArea()
  const router = useRouter()

  const { data } = useSWR<ExpandedDocument>(
    loadData && !baseSpecs
      ? basePathUrl(`/api/base-specs?area=${area}&expand=${expand}`)
      : null,
    swrFetcher,
    {
      errorRetryInterval: 2000,
    }
  )

  useEffect(() => {
    setExpand(getCurrentTag())
  }, [])

  useEffect(() => {
    setLoadData(true)
  }, [expand])

  useEffect(() => {
    if (data) {
      setBaseSpecs(data)
    }
    if (data?.tags) {
      setTags(data.tags)
    }
  }, [data, setBaseSpecs])

  useEffect(() => {
    if (baseSpecs) {
      if (prevArea !== area) {
        setBaseSpecs(null)
        setLoadData(true)
        return
      }

      const itemsToAdd: SidebarItem[] = [
        {
          type: "separator",
        },
      ]

      if (baseSpecs.tags) {
        baseSpecs.tags.forEach((tag) => {
          const tagPathName = getSectionId([tag.name.toLowerCase()])
          const childItems =
            baseSpecs.expandedTags &&
            Object.hasOwn(baseSpecs.expandedTags, tagPathName)
              ? getTagChildSidebarItems(baseSpecs.expandedTags[tagPathName])
              : []
          itemsToAdd.push({
            type: "category",
            title: tag.name,
            children: childItems,
            loaded: childItems.length > 0,
            showLoadingIfEmpty: true,
            onOpen: () => {
              if (location.hash !== tagPathName) {
                router.push(`#${tagPathName}`, {
                  scroll: false,
                })
              }
              if (activePath !== tagPathName) {
                setActivePath(tagPathName)
              }
            },
          })
        })
      }

      addItems(itemsToAdd, {
        section: SidebarItemSections.DEFAULT,
      })
    }
  }, [baseSpecs, prevArea, area])

  return (
    <>
      {tags.map((tag, index) => (
        <TagSection tag={tag} key={index} />
      ))}
    </>
  )
}

export default Tags
