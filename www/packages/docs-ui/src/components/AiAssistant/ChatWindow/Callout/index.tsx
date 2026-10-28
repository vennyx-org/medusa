"use client"

import React from "react"
import { Card } from "../../../Card"
import { useChat } from "@kapaai/react-sdk"
import { useAiAssistant } from "../../../../providers/AiAssistant"
import { useMedusaSuggestions } from "../../../../hooks/use-medusa-suggestions"
import { useAnalytics } from "../../../../providers/Analytics"
import { DocsTrackingEvents } from "../../../../constants"

export const AiAssistantChatWindowCallout = () => {
  const { conversation } = useChat()
  const { loading } = useAiAssistant()
  const { track } = useAnalytics()

  const lastQuestion = conversation.getLatestCompleted()?.question

  const matchedCallout = useMedusaSuggestions({
    keywords: lastQuestion || "",
  })

  if (loading || !matchedCallout) {
    return null
  }

  return (
    <div className="m-docs_1 flex justify-center items-center">
      <Card
        {...matchedCallout}
        onClick={() => {
          track({
            event: {
              event: DocsTrackingEvents.AI_ASSISTANT_CALLOUT_CLICK,
              options: {
                user_keywords: lastQuestion || "",
                callout_title: matchedCallout.title || "",
                callout_href: matchedCallout.href || "",
              },
            },
          })
        }}
      />
    </div>
  )
}
