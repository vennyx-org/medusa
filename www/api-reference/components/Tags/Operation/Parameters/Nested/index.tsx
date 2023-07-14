import clsx from "clsx"

export type TagsOperationParametersNestedProps =
  React.HTMLAttributes<HTMLDivElement>

const TagsOperationParametersNested = ({
  children,
  ...props
}: TagsOperationParametersNestedProps) => {
  return (
    <div
      {...props}
      className={clsx(
        props.className,
        "bg-docs-bg-surface dark:bg-docs-bg-surface-dark px-2 pt-1",
        "border-medusa-border-base dark:border-medusa-border-base-dark my-1 rounded border"
      )}
    >
      {children}
    </div>
  )
}

export default TagsOperationParametersNested
