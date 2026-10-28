"use client"

import React from "react"
import { NavigationItemLink } from "types"
import { LinkButton } from "../../../LinkButton"
import clsx from "clsx"

type MainNavItemLinkProps = {
  item: NavigationItemLink
  isActive: boolean
  icon?: React.ReactNode
  className?: string
}

export const MainNavItemLink = ({
  item,
  isActive,
  icon,
  className,
}: MainNavItemLinkProps) => {
  return (
    <LinkButton
      href={item.link}
      className={clsx(
        isActive && "text-medusa-fg-base",
        !isActive && "text-medusa-fg-muted hover:text-medusa-fg-subtle",
        className
      )}
    >
      {item.title}
      {icon}
    </LinkButton>
  )
}
