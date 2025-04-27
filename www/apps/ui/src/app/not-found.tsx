import type { Metadata } from "next"
import Link from "next/link"
import { CardList, MDXComponents } from "docs-ui"
import {
  BookOpen,
  AcademicCapSolid,
  ComputerDesktopSolid,
  BuildingStorefront,
} from "@medusajs/icons"
import React from "react"

const H1 = MDXComponents.h1!
const P = MDXComponents.p!

export const metadata: Metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return (
    <div>
      {/* @ts-expect-error React v19 doesn't recognize these as elements. */}
      <H1 hideLlmDropdown>Page Not Found</H1>
      {/* @ts-expect-error React v19 doesn't recognize these as elements. */}
      <P>The page you were looking for isn&apos;t available.</P>
      {/* @ts-expect-error React v19 doesn't recognize these as elements. */}
      <P>
        If you think this is a mistake, please
        <Link href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml">
          report this issue on GitHub
        </Link>
      </P>
      <CardList
        itemsPerRow={2}
        items={[
          {
            title: "Get Started Docs",
            href: "/",
            icon: BookOpen,
          },
          {
            title: "Commerce Modules",
            href: "!resources!/commerce-modules",
            icon: AcademicCapSolid,
          },
          {
            title: "Admin API reference",
            href: "!api!/admin",
            icon: ComputerDesktopSolid,
          },
          {
            title: "Store API reference",
            href: "!api!/store",
            icon: BuildingStorefront,
          },
        ]}
      />
    </div>
  )
}
