import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../../../AiAssistant/__mocks__"

// mock components
vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => AiAssistantMocks.mockUseAiAssistant(),
}))
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    config: {
      basePath: "http://example.com",
    },
  }),
}))
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({
    children,
    innerClassName,
  }: {
    children: React.ReactNode
    innerClassName: string
  }) => (
    <div data-testid="tooltip">
      {children} - {innerClassName}
    </div>
  ),
}))

import { CodeBlockAskAiAction } from "../../AskAi"

beforeEach(() => {
  AiAssistantMocks.mockSetChatOpened.mockClear()
  AiAssistantMocks.mockUseAiAssistant.mockReturnValue(
    AiAssistantMocks.defaultUseAiAssistantReturn
  )
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
})

describe("rendering", () => {
  test("render code block ask ai action in header", () => {
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={true}
      />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent("flex")
    const span = tooltip?.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[4.5px]")
    expect(span).toHaveClass("cursor-pointer")
    const image = span?.querySelector("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("width", "15")
    expect(image).toHaveAttribute("height", "15")
    expect(image).toHaveAttribute("alt", "Ask AI")
  })

  test("render code block ask ai action not in header", () => {
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const span = tooltip?.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[6px]")
  })
})

describe("interactions", () => {
  test("click code block ask ai action", () => {
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(true)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      "```tsx\nconsole.log('Hello, world!');\n```\n\nExplain the code above"
    )
  })
  test("click code block ask ai action when loading", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValue({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      loading: true,
    })
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    expect(AiAssistantMocks.mockSetChatOpened).not.toHaveBeenCalled()
    expect(AiAssistantMocks.mockSubmitQuery).not.toHaveBeenCalled()
  })
})
