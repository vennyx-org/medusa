"use client"

import {
  AnalyticsProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
} from "docs-ui"
import SearchProvider from "./search"
import SidebarProvider from "./sidebar"
import { siteConfig } from "../config/site"
import { MainNavProvider } from "./main-nav"

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={siteConfig}>
        <ScrollControllerProvider scrollableSelector="#main">
          <SidebarProvider>
            <MainNavProvider>
              <SearchProvider>{children}</SearchProvider>
            </MainNavProvider>
          </SidebarProvider>
        </ScrollControllerProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
