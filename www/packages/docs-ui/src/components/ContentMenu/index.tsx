"use client"

import clsx from "clsx"
import React from "react"
import { ContentMenuVersion } from "./Version"
import { ContentMenuToc } from "./Toc"
import { ContentMenuActions } from "./Actions"
import { ContentMenuProducts } from "./Products"
import { useLayout } from "../../providers/Layout"

export const ContentMenu = () => {
  const { showCollapsedNavbar } = useLayout()

  return (
    <div
      className={clsx(
        "hidden lg:flex w-full max-w-sidebar-lg",
        "flex-col gap-docs_2 pb-docs_1.5 mr-docs_1",
        "fixed top-[57px] right-docs_0.25 z-10",
        showCollapsedNavbar && "max-h-[calc(100%-112px)] pt-[84px]",
        !showCollapsedNavbar && "max-h-[calc(100%-56px)] pt-[28px]"
      )}
    >
      <ContentMenuVersion />
      <div className="flex flex-col gap-docs_1.5 flex-1 overflow-auto">
        <ContentMenuToc />
        <ContentMenuActions />
        <ContentMenuProducts />
      </div>
    </div>
  )
}
