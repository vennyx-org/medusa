import clsx from "clsx"
import React from "react"
import { LlmDropdown } from "../../LlmDropdown"

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
  hideLlmDropdown?: boolean
}

export const H1 = ({ className, hideLlmDropdown, ...props }: H1Props) => {
  return (
    <div className="flex items-start justify-between gap-2">
      <h1
        className={clsx(
          "h1-docs [&_code]:!h1-docs [&_code]:!font-mono mb-docs_1 text-medusa-fg-base",
          props.id && "scroll-m-docs_7",
          className
        )}
        {...props}
      />
      {!hideLlmDropdown && <LlmDropdown />}
    </div>
  )
}
