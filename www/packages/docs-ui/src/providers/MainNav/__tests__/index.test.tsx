import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { MainNavProvider, useMainNav } from "../index"
import type { NavigationItem } from "types"

// mock data
const defaultUseSiteConfigReturn = {
  config: {
    baseUrl: "",
    basePath: "",
    project: {
      key: "test-project",
      title: "Test Project",
    },
  },
}

// mock hooks
const mockPathname = "/test-path"
const mockUsePathname = vi.fn(() => mockPathname)

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

const TestComponent = () => {
  const { navItems, activeItemIndex, activeItem } = useMainNav()
  return (
    <div>
      <div data-testid="nav-items-count">{navItems.length}</div>
      <div data-testid="active-index">
        {activeItemIndex !== undefined ? activeItemIndex : "none"}
      </div>
      <div data-testid="active-item">{activeItem?.title || "none"}</div>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUsePathname.mockReturnValue("/test-path")
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const navItems: NavigationItem[] = []
    const { container } = render(
      <MainNavProvider navItems={navItems}>
        <div>Test</div>
      </MainNavProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useMainNav hook", () => {
  test("provides navItems", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
    ]

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("nav-items-count")).toHaveTextContent("1")
  })

  test("finds active item index for matching link", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "link",
        title: "Test",
        link: "/test-path",
      },
    ]

    mockUsePathname.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Test")
  })

  test("finds active item in dropdown", () => {
    const navItems: NavigationItem[] = [
      {
        type: "dropdown",
        title: "Docs",
        link: "/docs",
        children: [
          {
            type: "link",
            title: "Getting Started",
            link: "/docs/getting-started",
          },
          {
            type: "link",
            title: "API",
            link: "/docs/api",
          },
        ],
      },
    ]

    mockUsePathname.mockReturnValue("/docs/api")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("0")
  })

  test("uses fallback index when useAsFallback is true", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Fallback",
        link: "/fallback",
        useAsFallback: true,
      },
      {
        type: "link",
        title: "Other",
        link: "/other",
      },
    ]

    mockUsePathname.mockReturnValue("/fallback/nonexistent")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    // Should use fallback index when no exact match
    expect(getByTestId("active-index")).toHaveTextContent("0")
  })

  test("filters items by project key", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Project A",
        link: "/project-a",
        project: "project-a",
      },
      {
        type: "link",
        title: "Test Project",
        link: "/test",
        project: "test-project",
      },
    ]

    mockUsePathname.mockReturnValue("/test")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useMainNav must be used within a MainNavProvider")

    consoleSpy.mockRestore()
  })
})
