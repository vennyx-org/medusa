export enum SidebarItemSections {
  DEFAULT = "default",
  MOBILE = "mobile",
}

export type SidebarItemCommon = {
  title: string
  children?: SidebarItem[]
  isChildSidebar?: boolean
  hasTitleStyling?: boolean
  childSidebarTitle?: string
  loaded?: boolean
  additionalElms?: React.ReactNode
}

export type SidebarItemLink = SidebarItemCommon & {
  type: "link"
  path: string
  isPathHref?: boolean
  linkProps?: React.AllHTMLAttributes<HTMLAnchorElement>
  childrenSameLevel?: boolean
}

export type SidebarItemCategory = SidebarItemCommon & {
  type: "category"
  onOpen?: () => void
  initialOpen?: boolean
}

export type SidebarItemSubCategory = SidebarItemCommon & {
  type: "sub-category"
  childrenSameLevel?: boolean
}

export type SidebarItemSeparator = {
  type: "separator"
}

export type InteractiveSidebarItem =
  | SidebarItemLink
  | SidebarItemCategory
  | SidebarItemSubCategory

export type SidebarItemLinkWithParent = SidebarItemLink & {
  parentItem?: InteractiveSidebarItem
}

export type SidebarItem = InteractiveSidebarItem | SidebarItemSeparator

export type SidebarSectionItems = {
  [k in SidebarItemSections]: SidebarItem[]
} & {
  parentItem?: InteractiveSidebarItem
}

export type RawSidebarItem = SidebarItem & {
  autogenerate_path?: string
  custom_autogenerate?: string
  number?: string
}

export type PersistedSidebarCategoryState = {
  [k: string]: {
    [k: string]: boolean
  }
}
