import clsx from "clsx"
import React from "react"

export type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
}

export const H1 = ({ className, ...props }: H1Props) => {
  return (
    <div className="flex items-start justify-between gap-2 h1-wrapper">
      <h1
        className={clsx(
          "text-h1 [&>code]:!text-h1 [&>code]:!font-mono mb-docs_1 text-medusa-fg-base",
          props.id && "scroll-m-docs_7",
          className
        )}
        {...props}
      />
    </div>
  )
}
