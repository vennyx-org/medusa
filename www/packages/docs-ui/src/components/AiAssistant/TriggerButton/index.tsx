"use client"

import React from "react"
import { Button } from "../../Button"
import { Tooltip } from "../../Tooltip"
import { Kbd } from "../../Kbd"
import { getOsShortcut } from "../../../utils/os-browser-utils"
import { useAiAssistant } from "../../../providers/AiAssistant"
import { useKeyboardShortcut } from "../../../hooks"
import { useSearch } from "../../../providers/Search"
import { useSiteConfig } from "../../../providers/SiteConfig"
import Image from "next/image"

const AI_ASSISTANT_ICON_ACTIVE = "/images/ai-assistent.png"

export const AiAssistantTriggerButton = () => {
  const { config } = useSiteConfig()
  const { setChatOpened } = useAiAssistant()
  const { setIsOpen } = useSearch()
  const osShortcut = getOsShortcut()

  useKeyboardShortcut({
    metakey: true,
    shortcutKeys: ["i"],
    action: () => {
      setChatOpened((prev) => !prev)
      setIsOpen(false)
    },
    checkEditing: false,
  })

  return (
    <Tooltip
      render={() => (
        <span className="flex gap-[5px] items-center">
          <Kbd className="bg-medusa-bg-field-component border-medusa-border-strong w-[18px] h-[18px] inline-block">
            {osShortcut}
          </Kbd>
          <Kbd className="bg-medusa-bg-field-component border-medusa-border-strong w-[18px] h-[18px] inline-block">
            i
          </Kbd>
        </span>
      )}
    >
      <Button
        variant="transparent-clear"
        onClick={() => setChatOpened((prev) => !prev)}
      >
        <Image
          src={`${config.basePath}${AI_ASSISTANT_ICON_ACTIVE}`}
          width={15}
          height={15}
          alt="AI Assistant"
        />
        <span className="hidden md:inline-block text-medusa-fg-subtle">
          Ask AI
        </span>
      </Button>
    </Tooltip>
  )
}
