"use client"

import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import type { OpenAPIV3 } from "openapi-types"
import getSectionId from "@/utils/get-section-id"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useInView } from "react-intersection-observer"
import { isElmWindow, useScrollController, useSidebar } from "docs-ui"
import type { TagOperationCodeSectionProps } from "./CodeSection"
import TagsOperationDescriptionSection from "./DescriptionSection"
import DividedLayout from "@/layouts/Divided"
import { useLoading } from "@/providers/loading"
import { useRouter } from "next/navigation"
import SectionDivider from "../../Section/Divider"
import checkElementInViewport from "../../../utils/check-element-in-viewport"

const TagOperationCodeSection = dynamic<TagOperationCodeSectionProps>(
  async () => import("./CodeSection")
) as React.FC<TagOperationCodeSectionProps>

export type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
  endpointPath: string
  className?: string
}

const TagOperation = ({
  operation,
  method,
  endpointPath,
  className,
}: TagOperationProps) => {
  const { activePath, setActivePath } = useSidebar()
  const router = useRouter()
  const [show, setShow] = useState(false)
  const path = useMemo(
    () => getSectionId([...(operation.tags || []), operation.operationId]),
    [operation]
  )
  const nodeRef = useRef<Element | null>(null)
  const { loading, removeLoading } = useLoading()
  const { scrollableElement, scrollToTop } = useScrollController()
  const root = useMemo(() => {
    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [scrollableElement])
  const { ref } = useInView({
    threshold: 0.3,
    rootMargin: `112px 0px 112px 0px`,
    root,
    onChange: (changedInView) => {
      if (changedInView) {
        if (!show) {
          if (loading) {
            removeLoading()
          }
          setShow(true)
        }
        if (location.hash !== path) {
          router.push(`#${path}`, {
            scroll: false,
          })
        }
        if (activePath !== path) {
          setActivePath(path)
        }
      }
    },
  })

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node: Element | null) => {
      // Ref's from useRef needs to have the node assigned to `current`
      nodeRef.current = node
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      ref(node)
    },
    [ref]
  )

  const scrollIntoView = useCallback(() => {
    if (nodeRef.current && !checkElementInViewport(nodeRef.current, 0)) {
      const elm = nodeRef.current as HTMLElement
      scrollToTop(
        elm.offsetTop + (elm.offsetParent as HTMLElement)?.offsetTop,
        0
      )
    }
    setShow(true)
  }, [scrollToTop, nodeRef])

  useEffect(() => {
    if (nodeRef && nodeRef.current) {
      removeLoading()
      const currentHash = location.hash.replace("#", "")
      if (currentHash === path) {
        setTimeout(scrollIntoView, 100)
      } else if (currentHash.split("_")[0] === path.split("_")[0]) {
        setShow(true)
      }
    }
  }, [nodeRef, path, scrollIntoView])

  return (
    <div
      className={clsx("relative min-h-screen w-full pb-7", className)}
      id={path}
      ref={setRefs}
    >
      <div
        className={clsx(
          "flex w-full justify-between gap-1 opacity-0",
          !show && "invisible",
          show && "animate-fadeIn"
        )}
        style={{
          animationFillMode: "forwards",
        }}
      >
        <DividedLayout
          mainContent={
            <TagsOperationDescriptionSection operation={operation} />
          }
          codeContent={
            <TagOperationCodeSection
              method={method || ""}
              operation={operation}
              endpointPath={endpointPath}
            />
          }
        />
      </div>
      <SectionDivider />
    </div>
  )
}

export default TagOperation
