"use client"

import React, { useEffect } from "react"
import { ToCItem, ToCItemUi } from "types"
import { useScrollController } from "../../../hooks/use-scroll-utils"
import {
  ActiveOnScrollItem,
  useActiveOnScroll,
} from "../../../hooks/use-active-on-scroll"
import clsx from "clsx"
import Link from "next/link"
import { useSiteConfig } from "../../../providers/SiteConfig"
import { Loading } from "../../Loading"

export const ContentMenuToc = () => {
  const { toc: items, frontmatter, setToc } = useSiteConfig()
  const { items: generatedItems, activeItemId } = useActiveOnScroll({
    maxLevel: 4,
  })

  const formatHeadingContent = (heading: HTMLHeadingElement): string => {
    return Array.from(heading.childNodes)
      .filter((child) => child.nodeType === Node.TEXT_NODE && child.textContent)
      .map((textNode) => textNode.textContent!.trim())
      .join("")
  }

  const formatHeadingObject = ({
    heading,
    children,
  }: ActiveOnScrollItem): ToCItemUi => {
    const level = parseInt(heading.tagName.replace("H", ""))
    return {
      title: formatHeadingContent(heading),
      id: heading.id,
      level,
      children: children?.map(formatHeadingObject),
      associatedHeading: heading as HTMLHeadingElement,
    }
  }

  useEffect(() => {
    if (
      frontmatter.generate_toc &&
      generatedItems &&
      items?.length !== generatedItems.length
    ) {
      const tocItems: ToCItem[] = generatedItems.map(formatHeadingObject)
      setToc(tocItems)
    }
  }, [frontmatter, generatedItems])

  useEffect(() => {
    const activeElement = document.querySelector(
      ".toc-item a[href='#" + activeItemId + "']"
    ) as HTMLAnchorElement
    if (!activeElement) {
      return
    }

    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    })
  }, [activeItemId])

  if (items && !items.length) {
    return <></>
  }

  return (
    <div className="h-max max-h-full overflow-y-hidden flex relative flex-col">
      <div className="absolute left-0 top-docs_0.5 h-[calc(100%-8px)] w-[1.5px] bg-medusa-border-base" />
      {items !== null && (
        <TocList
          items={items}
          activeItemId={activeItemId}
          className="relative overflow-y-auto"
        />
      )}
      {items === null && <EmptyTocItems />}
    </div>
  )
}

type TocListProps = {
  items: ToCItem[]
  activeItemId: string
  className?: string
}

const TocList = ({ items, activeItemId, className }: TocListProps) => {
  return (
    <ul className={className} data-testid="toc-list">
      {items.map((item) => (
        <TocItem item={item} key={item.id} activeItemId={activeItemId} />
      ))}
    </ul>
  )
}

type TocItemProps = {
  item: ToCItem
  activeItemId: string
}

const TocItem = ({ item, activeItemId }: TocItemProps) => {
  const { scrollToElement } = useScrollController()
  return (
    <li className="w-full pt-docs_0.5 toc-item" data-testid="toc-item">
      <Link
        href={`#${item.id}`}
        className={clsx(
          "text-x-small-plus block w-full relative",
          item.id !== activeItemId &&
            "text-medusa-fg-muted hover:text-medusa-fg-base border-transparent"
        )}
        style={{
          paddingLeft: `${(item.level - 1) * 12}px`,
        }}
        onClick={(e) => {
          e.preventDefault()
          history.pushState({}, "", `#${item.id}`)
          const elm = document.getElementById(item.id) as HTMLElement
          scrollToElement(elm)
        }}
      >
        <span
          className={clsx(
            "absolute left-0 top-0 w-[1.5px] h-full bg-medusa-fg-base rounded-full",
            item.id !== activeItemId && "invisible"
          )}
        />
        {item.title}
      </Link>
      {(item.children?.length ?? 0) > 0 && (
        <TocList items={item.children!} activeItemId={activeItemId} />
      )}
    </li>
  )
}

const EmptyTocItems = () => {
  return (
    <div className="animate-pulse" data-testid="empty-toc-items">
      <Loading count={5} className="pt-docs_0.5 px-docs_0.75 !my-0" />
    </div>
  )
}
