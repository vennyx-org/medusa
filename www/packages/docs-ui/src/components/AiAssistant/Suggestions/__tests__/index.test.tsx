import React from "react"
import { beforeAll, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../__mocks__"

// Mock components and hooks
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    config: {
      baseUrl: "https://docs.medusajs.com",
    },
  }),
}))
vi.mock("@/components/Link", () => ({
  Link: ({
    children,
    href,
    variant,
  }: {
    children: React.ReactNode
    href: string
    variant: "content"
  }) => (
    <a
      href={href}
      className={
        variant === "content"
          ? "text-medusa-fg-content"
          : "text-medusa-fg-muted"
      }
    >
      {children}
    </a>
  ),
}))

vi.mock("@/components/Search/Hits/GroupName", () => ({
  SearchHitGroupName: ({ name }: { name: string }) => <div>{name}</div>,
}))
vi.mock("@/components/Search/Suggestions/Item", () => ({
  SearchSuggestionItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick: () => void
  }) => (
    <div onClick={onClick} className="suggestion-item">
      {children}
    </div>
  ),
}))
import { AiAssistantSuggestions } from "../index"

beforeAll(() => {
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
  AiAssistantMocks.mockAddFeedback.mockClear()
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockStopGeneration.mockClear()
  AiAssistantMocks.mockConversation.length = 1
})

describe("rendering", () => {
  test("renders suggestions", () => {
    const { container } = render(<AiAssistantSuggestions />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("FAQ")
    expect(container).toHaveTextContent("Recipes")
    expect(container).toHaveTextContent("What is Medusa?")
    expect(container).toHaveTextContent("How can I create a module?")
    expect(container).toHaveTextContent("How can I create a data model?")
    expect(container).toHaveTextContent("How do I create a workflow?")
    expect(container).toHaveTextContent(
      "How can I extend a data model in the Product Module?"
    )
    expect(container).toHaveTextContent(
      "How do I build a marketplace with Medusa?"
    )
    expect(container).toHaveTextContent(
      "How do I build digital products with Medusa?"
    )
    expect(container).toHaveTextContent(
      "How do I build subscription-based purchases with Medusa?"
    )
    expect(container).toHaveTextContent(
      "What other recipes are available in the Medusa documentation?"
    )
    expect(container).toHaveTextContent("Medusa MCP server")
  })
})

describe("interaction", () => {
  test("clicking a suggestion item should submit the query", () => {
    const { container } = render(<AiAssistantSuggestions />)
    expect(container).toBeInTheDocument()
    const suggestionItem = container.querySelector(".suggestion-item")
    expect(suggestionItem).toBeInTheDocument()
    fireEvent.click(suggestionItem!)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      suggestionItem!.textContent
    )
  })
})
