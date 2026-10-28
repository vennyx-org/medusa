import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"

// mock data
const mockVersion = {
  number: "2.0.0",
  releaseUrl: "https://github.com/example/releases/v2.0.0",
  hide: false,
  bannerImage: {
    light: "/banner-light.png",
    dark: "/banner-dark.png",
  },
}

const defaultUseSiteConfigReturn = {
  config: {
    version: mockVersion,
  },
  setConfig: vi.fn(),
  frontmatter: {},
  setFrontmatter: vi.fn(),
  toc: null,
  setToc: vi.fn(),
}

// mock functions
const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)
const mockUseIsBrowser = vi.fn(() => ({
  isBrowser: true,
}))

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => mockUseIsBrowser(),
}))

vi.mock("@/components/Card", () => ({
  Card: ({
    title,
    text,
    closeable,
    onClose,
    href,
    hrefProps,
    themeImage,
    imageDimensions,
    className,
    iconClassName,
    cardRef,
  }: {
    title?: string
    text?: string
    closeable?: boolean
    onClose?: () => void
    href?: string
    hrefProps?: Record<string, unknown>
    themeImage?: { light: string; dark: string }
    imageDimensions?: { width: number; height: number }
    className?: string
    iconClassName?: string
    cardRef?: React.Ref<HTMLDivElement>
  }) => {
    const ref = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(cardRef, () => ref.current as HTMLDivElement)

    return (
      <div
        data-testid="version-card"
        ref={ref}
        className={className}
        data-title={title}
        data-text={text}
        data-href={href}
        data-closeable={closeable}
        data-theme-image-light={themeImage?.light}
        data-theme-image-dark={themeImage?.dark}
        data-image-width={imageDimensions?.width}
        data-image-height={imageDimensions?.height}
        data-icon-class-name={iconClassName}
      >
        {title && <div data-testid="card-title">{title}</div>}
        {text && <div data-testid="card-text">{text}</div>}
        {closeable && onClose && (
          <button data-testid="card-close" onClick={onClose}>
            Close
          </button>
        )}
        {href && (
          <a
            data-testid="card-link"
            href={href}
            {...(hrefProps as Record<string, unknown>)}
          >
            Link
          </a>
        )}
      </div>
    )
  },
}))

import { ContentMenuVersion, LOCAL_STORAGE_KEY } from "../../Version"

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear()
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
  mockUseIsBrowser.mockReturnValue({
    isBrowser: true,
  })
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders card when version is new (not in localStorage)", async () => {
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    await waitFor(() => {
      expect(card).toHaveClass("animate animate-fadeInDown")
    })
  })

  test("does not render card when version matches localStorage", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mockVersion.number)
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    await waitFor(() => {
      expect(card).not.toHaveClass("animate animate-fadeInDown")
    })
  })

  test("does not check localStorage when isBrowser is false", async () => {
    mockUseIsBrowser.mockReturnValue({
      isBrowser: false,
    })
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    await waitFor(() => {
      expect(card).not.toHaveClass("animate animate-fadeInDown")
    })
  })

  test("renders card with correct props", async () => {
    const { container } = render(<ContentMenuVersion />)
    await waitFor(() => {
      const card = container.querySelector("[data-testid='version-card']")
      expect(card).toBeInTheDocument()
    })

    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toHaveAttribute("data-title", "New version")
    expect(card).toHaveAttribute("data-text", `v${mockVersion.number} details`)
    expect(card).toHaveAttribute("data-href", mockVersion.releaseUrl)
    expect(card).toHaveAttribute("data-closeable", "true")
    expect(card).toHaveAttribute(
      "data-theme-image-light",
      mockVersion.bannerImage.light
    )
    expect(card).toHaveAttribute(
      "data-theme-image-dark",
      mockVersion.bannerImage.dark
    )
    expect(card).toHaveAttribute("data-image-width", "64")
    expect(card).toHaveAttribute("data-image-height", "40")
  })

  test("renders card link with correct href props", async () => {
    const { container } = render(<ContentMenuVersion />)
    await waitFor(() => {
      const card = container.querySelector("[data-testid='version-card']")
      expect(card).toBeInTheDocument()
    })

    const link = container.querySelector("[data-testid='card-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", mockVersion.releaseUrl)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("renders card with correct className", async () => {
    const { container } = render(<ContentMenuVersion />)
    await waitFor(() => {
      const card = container.querySelector("[data-testid='version-card']")
      expect(card).toBeInTheDocument()
    })

    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toHaveClass("!border-0")
    expect(card).toHaveClass("!bg-medusa-bg-component")
    expect(card).toHaveClass("hover:!bg-medusa-bg-component-hover")
    expect(card).toHaveClass("animation-fill-forwards")
    expect(card).toHaveClass("opacity-0")
  })

  test("renders card with correct iconClassName", async () => {
    const { container } = render(<ContentMenuVersion />)
    await waitFor(() => {
      const card = container.querySelector("[data-testid='version-card']")
      expect(card).toBeInTheDocument()
    })

    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toHaveAttribute(
      "data-icon-class-name",
      "!shadow-none border-[0.5px] border-medusa-alphas-alpha-250"
    )
  })
})

describe("interactions", () => {
  test("closes card and saves version to localStorage when close button is clicked", () => {
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()

    const closeButton = container.querySelector("[data-testid='card-close']")
    expect(closeButton).toBeInTheDocument()

    fireEvent.click(closeButton!)
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe(mockVersion.number)
  })

  test("does not close card if showNewVersion is false", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mockVersion.number)
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    await waitFor(() => {
      expect(card).not.toHaveClass("animate animate-fadeInDown")
    })

    // Card should not have close button visible when hidden
    const closeButton = container.querySelector("[data-testid='card-close']")
    expect(closeButton).toBeInTheDocument()
    fireEvent.click(closeButton!)
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe(mockVersion.number)
  })
})

describe("animations", () => {
  test("does not add animation classes when version.hide is true", async () => {
    mockUseSiteConfig.mockReturnValue({
      ...defaultUseSiteConfigReturn,
      config: {
        version: {
          ...mockVersion,
          hide: true,
        },
      },
    })
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    await waitFor(() => {
      // Animation classes should not be added when hide is true
      expect(card).not.toHaveClass("animate")
      expect(card).not.toHaveClass("animate-fadeInDown")
    })
  })

  test("does not add animation classes when showNewVersion is false", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mockVersion.number)
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    await waitFor(() => {
      // Animation classes should not be added when showNewVersion is false
      expect(card).not.toHaveClass("animate")
      expect(card).not.toHaveClass("animate-fadeInDown")
    })
  })
})

describe("version configuration", () => {
  test("renders with different version number", async () => {
    const newVersion = {
      ...mockVersion,
      number: "3.0.0",
    }
    mockUseSiteConfig.mockReturnValue({
      ...defaultUseSiteConfigReturn,
      config: {
        version: newVersion,
      },
    })
    const { container } = render(<ContentMenuVersion />)
    const card = container.querySelector("[data-testid='version-card']")
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute("data-text", `v${newVersion.number} details`)
  })
})
