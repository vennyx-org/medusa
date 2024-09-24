import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import Providers from "@/providers"
import "./globals.css"
import { TightLayout } from "docs-ui"
import { config } from "@/config"
import clsx from "clsx"
import { Feedback } from "@/components/Feedback"
import EditButton from "@/components/EditButton"

export const metadata: Metadata = {
  title: {
    template: `%s - ${config.titleSuffix}`,
    default: config.titleSuffix || "",
  },
  description:
    "Explore Medusa's recipes, API references, configurations, storefront guides, and more.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
}

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
})

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TightLayout
      ProvidersComponent={Providers}
      sidebarProps={{
        expandItems: true,
      }}
      bodyClassName={clsx(inter.variable, robotoMono.variable)}
      feedbackComponent={<Feedback className="my-2" />}
      editComponent={<EditButton />}
    >
      {children}
    </TightLayout>
  )
}
