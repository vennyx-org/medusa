"use client"

import React, { createContext, useContext, useState } from "react"
import { DocsConfig, FrontMatter, ToCItem } from "types"
import { globalConfig } from "../../global-config"
import { GITHUB_ISSUES_LINK } from "../../constants"

export type SiteConfigContextType = {
  config: DocsConfig
  setConfig: React.Dispatch<React.SetStateAction<DocsConfig>>
  frontmatter: FrontMatter
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontMatter>>
  toc: ToCItem[] | null
  setToc: React.Dispatch<React.SetStateAction<ToCItem[] | null>>
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null)

export type SiteConfigProviderProps = {
  config?: DocsConfig
  children?: React.ReactNode
}

export const SiteConfigProvider = ({
  config: initConfig,
  children,
}: SiteConfigProviderProps) => {
  const [config, setConfig] = useState<DocsConfig>(
    Object.assign(
      {
        baseUrl: "",
        sidebars: [],
        project: {
          title: "",
          key: "",
        },
        reportIssueLink: GITHUB_ISSUES_LINK,
        logo: "",
      },
      globalConfig,
      initConfig || {}
    )
  )
  const [frontmatter, setFrontmatter] = useState<FrontMatter>({})
  const [toc, setToc] = useState<ToCItem[] | null>(null)

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        setConfig,
        frontmatter,
        setFrontmatter,
        toc,
        setToc,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  )
}

export const useSiteConfig = (): SiteConfigContextType => {
  const context = useContext(SiteConfigContext)

  if (!context) {
    throw new Error("useSiteConfig must be used inside a SiteConfigProvider")
  }

  return context
}
