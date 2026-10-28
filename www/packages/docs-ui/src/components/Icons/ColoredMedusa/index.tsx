import { Medusa } from "@medusajs/icons"
import { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"
import React from "react"

export const ColoredMedusaIcon = ({ className, ...props }: IconProps) => {
  return (
    <Medusa
      {...props}
      className={clsx(className, "[&_path]:fill-medusa-fg-subtle")}
    />
  )
}
