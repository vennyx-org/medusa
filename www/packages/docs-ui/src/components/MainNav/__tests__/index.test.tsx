import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ButtonProps } from "../../Button"

// mock data
const mockConfig = {
  baseUrl: "https://docs.medusajs.com",
  logo: "/logo.png",
}

const defaultUseSiteConfigReturn = {
  config: mockConfig,
}

// mock functions
const mockSetMobileSidebarOpen = vi.fn()
const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

const defaultUseSidebarReturn = {
  setMobileSidebarOpen: mockSetMobileSidebarOpen,
  isSidebarShown: true,
}

const defaultUseLayoutReturn = {
  showCollapsedNavbar: false,
  mainContentRef: React.createRef<HTMLDivElement>(),
}
const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)
const mockUseLayout = vi.fn(() => defaultUseLayoutReturn)

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/providers/Layout", () => ({
  useLayout: () => mockUseLayout(),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/BorderedIcon", () => ({
  BorderedIcon: ({
    icon,
    iconWrapperClassName,
    wrapperClassName,
    iconWidth,
    iconHeight,
    ...props
  }: {
    icon: string
    iconWrapperClassName?: string
    wrapperClassName?: string
    iconWidth?: number
    iconHeight?: number
    [key: string]: unknown
  }) => (
    <div
      data-testid="bordered-icon"
      data-icon={icon}
      data-wrapper-class={wrapperClassName}
      data-icon-width={iconWidth}
      data-icon-height={iconHeight}
      className={iconWrapperClassName}
      {...props}
    />
  ),
}))

vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))

vi.mock("@/components/Search/ModalOpener", () => ({
  SearchModalOpener: () => <div data-testid="search-modal-opener" />,
}))

vi.mock("@/components/AiAssistant/TriggerButton", () => ({
  AiAssistantTriggerButton: () => <div data-testid="ai-assistant-trigger" />,
}))

vi.mock("@/components/Icons/SidebarLeft", () => ({
  SidebarLeftIcon: () => <svg data-testid="sidebar-left-icon" />,
}))

vi.mock("@/components/MainNav/Items", () => ({
  MainNavItems: ({ className }: { className?: string }) => (
    <ul data-testid="nav-items" className={className} />
  ),
}))

vi.mock("@/components/MainNav/DesktopMenu", () => ({
  MainNavDesktopMenu: () => <div data-testid="desktop-menu" />,
}))

vi.mock("@/components/MainNav/MobileMenu", () => ({
  MainNavMobileMenu: () => <div data-testid="mobile-menu" />,
}))

vi.mock("@/components/MainNav/Version", () => ({
  MainNavVersion: () => <div data-testid="version" />,
}))

vi.mock("@/components/MainNav/Items/Dropdown", () => ({
  MainNavItemDropdown: ({
    item,
    className,
    wrapperClassName,
  }: {
    item: unknown
    className?: string
    wrapperClassName?: string
  }) => (
    <div
      data-testid="help-dropdown"
      className={className}
      data-wrapper-class={wrapperClassName}
    >
      {JSON.stringify(item)}
    </div>
  ),
}))

import { MainNav } from "../../MainNav"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders main nav", () => {
    const { container } = render(<MainNav />)
    const nav = container.querySelector("[data-testid='main-nav']")
    expect(nav).toBeInTheDocument()
    const logoLink = container.querySelector("[data-testid='logo-link']")
    expect(logoLink).toBeInTheDocument()
    const icon = container.querySelector("[data-testid='logo-icon']")
    expect(icon).toBeInTheDocument()
    const searchOpener = container.querySelector(
      "[data-testid='search-modal-opener']"
    )
    expect(searchOpener).toBeInTheDocument()
    const aiTrigger = container.querySelector(
      "[data-testid='ai-assistant-trigger']"
    )
    expect(aiTrigger).toBeInTheDocument()
    const desktopMenu = container.querySelector("[data-testid='desktop-menu']")
    expect(desktopMenu).toBeInTheDocument()
    const mobileMenu = container.querySelector("[data-testid='mobile-menu']")
    expect(mobileMenu).toBeInTheDocument()
    const version = container.querySelector("[data-testid='version']")
    const helpDropdown = container.querySelector(
      "[data-testid='help-dropdown']"
    )
    expect(version).toBeInTheDocument()
    expect(helpDropdown).toBeInTheDocument()
  })

  test("renders nav items when not collapsed", () => {
    const { container } = render(<MainNav />)
    const navItems = container.querySelector("[data-testid='nav-items']")
    expect(navItems).toBeInTheDocument()
  })

  test("renders mobile sidebar button when sidebar is shown", () => {
    const { container } = render(<MainNav />)
    const button = container.querySelector(
      "[data-testid='mobile-sidebar-button']"
    )
    expect(button).toBeInTheDocument()
  })

  test("does not render mobile sidebar button when sidebar is not shown", () => {
    mockUseSidebar.mockReturnValueOnce({
      ...defaultUseSidebarReturn,
      isSidebarShown: false,
      setMobileSidebarOpen: mockSetMobileSidebarOpen,
    })
    const { container } = render(<MainNav />)
    const button = container.querySelector(
      "[data-testid='mobile-sidebar-button']"
    )
    expect(button).not.toBeInTheDocument()
  })

  test("applies custom className", () => {
    const { container } = render(<MainNav className="custom-class" />)
    const nav = container.querySelector("[data-testid='main-nav']")
    expect(nav).toHaveClass("custom-class")
  })

  test("applies custom itemsClassName", () => {
    const { container } = render(
      <MainNav itemsClassName="custom-items-class" />
    )
    const navItems = container.querySelector("[data-testid='nav-items']")
    expect(navItems).toHaveClass("custom-items-class")
  })

  test("adjusts layout when collapsed", () => {
    mockUseLayout.mockReturnValueOnce({
      ...defaultUseLayoutReturn,
      showCollapsedNavbar: true,
    })
    const { container } = render(<MainNav />)
    const topBar = container.querySelector("[data-testid='main-nav-content']")
    expect(topBar).toBeInTheDocument()
    expect(topBar).toHaveClass("border-b border-medusa-border-base")
    const actionsContainer = container.querySelector(
      "[data-testid='main-nav-actions']"
    )
    expect(actionsContainer).toBeInTheDocument()
    expect(actionsContainer).toHaveClass("flex-grow justify-between")
    const collapsedNavItems = container.querySelector(
      "[data-testid='collapsed-nav-items']"
    )
    expect(collapsedNavItems).toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("opens mobile sidebar when button is clicked", () => {
    const { container } = render(<MainNav />)
    const button = container.querySelector(
      "[data-testid='mobile-sidebar-button']"
    )
    fireEvent.click(button!)
    expect(mockSetMobileSidebarOpen).toHaveBeenCalledWith(true)
  })
})
