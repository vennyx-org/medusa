"use client"

import { usePathname } from "next/navigation"
import React, { createContext, useContext, useMemo } from "react"
import { MenuItem, NavigationItem, NavigationItemDropdown } from "types"
import { useSiteConfig } from "../SiteConfig"

export type MainNavContext = {
  navItems: NavigationItem[]
  activeItemIndex?: number
  activeItem?: NavigationItem
  editDate?: string
}

const MainNavContext = createContext<MainNavContext | null>(null)

export type MainNavProviderProps = {
  navItems: NavigationItem[]
  children?: React.ReactNode
}

export const MainNavProvider = ({
  navItems,
  children,
}: MainNavProviderProps) => {
  const pathname = usePathname()
  const { config } = useSiteConfig()

  const baseUrl = `${config.baseUrl}${config.basePath}`

  const findActiveItem = (
    items: NavigationItemDropdown["children"],
    currentUrl: string
  ) => {
    let item: MenuItem | undefined
    let fallbackIndex: number | undefined
    items.some((childItem, index) => {
      if (childItem.type !== "link" && childItem.type !== "sub-menu") {
        return false
      }

      if (childItem.type === "sub-menu") {
        const activeChildRes = findActiveItem(childItem.items, currentUrl)
        item = activeChildRes.item
        fallbackIndex = activeChildRes.fallbackIndex
        return !!item
      }

      const isItemActive = currentUrl.startsWith(childItem.link)

      if (!isItemActive) {
        return false
      }

      if (childItem.useAsFallback && fallbackIndex === undefined) {
        fallbackIndex = index
        return false
      }

      item = childItem

      return true
    })

    return {
      item,
      fallbackIndex,
    }
  }

  const activeItemIndex = useMemo(() => {
    const currentUrl = `${baseUrl}${pathname}`.replace(/\/$/, "")

    let fallbackIndex: number | undefined

    const index = navItems.findIndex((item, index) => {
      if (item.type === "dropdown") {
        const { item: activeChild, fallbackIndex: childFallbackIndex } =
          findActiveItem(item.children, currentUrl)

        if (activeChild) {
          fallbackIndex = childFallbackIndex
          return true
        }

        return item.link && currentUrl.startsWith(item.link)
      }

      if (item.project && item.project !== config.project.key) {
        return false
      }

      const isItemActive = currentUrl.startsWith(item.link)

      if (isItemActive && item.useAsFallback && fallbackIndex === undefined) {
        fallbackIndex = index
        return false
      }

      return isItemActive
    })

    return index !== -1 ? index : fallbackIndex
  }, [navItems, pathname, baseUrl, config])

  const activeItem = useMemo(() => {
    if (activeItemIndex === undefined) {
      return
    }

    return navItems[activeItemIndex]
  }, [navItems, activeItemIndex])

  return (
    <MainNavContext.Provider
      value={{
        navItems,
        activeItemIndex,
        activeItem,
      }}
    >
      {children}
    </MainNavContext.Provider>
  )
}

export const useMainNav = () => {
  const context = useContext(MainNavContext)

  if (!context) {
    throw new Error("useMainNav must be used within a MainNavProvider")
  }

  return context
}
