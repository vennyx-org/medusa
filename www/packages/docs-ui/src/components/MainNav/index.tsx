"use client"

import clsx from "clsx"
import React from "react"
import { BorderedIcon } from "@/components/BorderedIcon"
import { Button } from "@/components/Button"
import { GITHUB_ISSUES_LINK } from "@/constants"
import { SearchModalOpener } from "@/components/Search/ModalOpener"
import { useLayout } from "@/providers/Layout"
import { useSidebar } from "@/providers/Sidebar"
import { useSiteConfig } from "@/providers/SiteConfig"
import { MainNavItems } from "./Items"
import { MainNavDesktopMenu } from "./DesktopMenu"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"
import { MainNavMobileMenu } from "./MobileMenu"
import Link from "next/link"
import { MainNavVersion } from "./Version"
import { AiAssistantTriggerButton } from "../AiAssistant/TriggerButton"
import { MainNavItemDropdown } from "./Items/Dropdown"

type MainNavProps = {
  className?: string
  itemsClassName?: string
}

export const MainNav = ({ className, itemsClassName }: MainNavProps) => {
  const { setMobileSidebarOpen, isSidebarShown } = useSidebar()
  const { config } = useSiteConfig()
  const { showCollapsedNavbar } = useLayout()

  return (
    <div
      className={clsx("w-full z-20 sticky top-0 bg-medusa-bg-base", className)}
      data-testid="main-nav"
    >
      <div
        className={clsx(
          "flex justify-between items-center px-docs_1 w-full gap-docs_1",
          showCollapsedNavbar && "border-b border-medusa-border-base"
        )}
        data-testid="main-nav-content"
      >
        <div className="flex items-center gap-[10px]">
          {isSidebarShown && (
            <Button
              className="lg:hidden my-docs_0.75 !p-[6.5px]"
              variant="transparent-clear"
              onClick={() => setMobileSidebarOpen(true)}
              data-testid="mobile-sidebar-button"
            >
              <SidebarLeftIcon />
            </Button>
          )}
          <Link href={`${config.baseUrl}`} data-testid="logo-link">
            <BorderedIcon
              icon={config.logo}
              iconWrapperClassName="my-[14px]"
              wrapperClassName="w-[20px] h-[20px]"
              iconWidth={20}
              iconHeight={20}
              data-testid="logo-icon"
            />
          </Link>
        </div>
        {!showCollapsedNavbar && (
          <MainNavItems className={clsx("flex-grow", itemsClassName)} />
        )}
        <div
          className={clsx(
            "flex items-center my-docs_0.75",
            showCollapsedNavbar && "flex-grow justify-between"
          )}
          data-testid="main-nav-actions"
        >
          <div className="lg:flex items-center gap-[6px] text-medusa-fg-subtle hidden">
            <MainNavVersion />
            <MainNavItemDropdown
              item={{
                type: "dropdown",
                title: "Help",
                children: [
                  {
                    type: "link",
                    title: "Troubleshooting",
                    link: "https://docs.medusajs.com/resources/troubleshooting",
                  },
                  {
                    type: "link",
                    title: "Report Issue",
                    link: GITHUB_ISSUES_LINK,
                  },
                  {
                    type: "link",
                    title: "Discord Community",
                    link: "https://discord.gg/medusajs",
                  },
                  {
                    type: "divider",
                  },
                  {
                    type: "link",
                    title: "Contact Sales",
                    link: "https://medusajs.com/contact/",
                  },
                ],
              }}
              isActive={false}
              className="text-medusa-fg-subtle hover:bg-medusa-button-transparent-hover rounded-docs_sm px-docs_0.5"
              wrapperClassName="z-10"
            />
          </div>
          <div className="flex items-center">
            <AiAssistantTriggerButton />
            <SearchModalOpener />
            <MainNavDesktopMenu />
            <MainNavMobileMenu />
          </div>
        </div>
      </div>
      {showCollapsedNavbar && (
        <div
          className={clsx("border-b border-medusa-border-base px-docs_1")}
          data-testid="collapsed-nav-items"
        >
          <MainNavItems className={clsx("flex-wrap", itemsClassName)} />
        </div>
      )}
    </div>
  )
}
