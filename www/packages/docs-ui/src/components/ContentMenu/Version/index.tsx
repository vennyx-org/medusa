import React, { useEffect, useState } from "react"
import { Card } from "../../Card"
import { useIsBrowser } from "../../../providers/BrowserProvider"
import { useSiteConfig } from "../../../providers/SiteConfig"
import clsx from "clsx"

export const LOCAL_STORAGE_KEY = "last-version"

export const ContentMenuVersion = () => {
  const {
    config: { version },
  } = useSiteConfig()
  const [showNewVersion, setShowNewVersion] = useState(false)
  const { isBrowser } = useIsBrowser()
  const cardRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const storedVersion = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedVersion !== version.number) {
      setShowNewVersion(true)
    }
  }, [isBrowser])

  const handleClose = () => {
    if (!showNewVersion) {
      return
    }

    setShowNewVersion(false)
    localStorage.setItem(LOCAL_STORAGE_KEY, version.number)
  }

  useEffect(() => {
    if (!showNewVersion || version.hide || !cardRef.current) {
      return
    }

    cardRef.current.classList.add("animate", "animate-fadeInDown")
  }, [showNewVersion, version.hide, cardRef])

  return (
    <Card
      type="mini"
      title={`New version`}
      text={`v${version.number} details`}
      closeable
      onClose={handleClose}
      href={version.releaseUrl}
      hrefProps={{
        target: "_blank",
        rel: "noopener noreferrer",
      }}
      themeImage={version.bannerImage}
      imageDimensions={{
        width: 64,
        height: 40,
      }}
      className={clsx(
        "!border-0 !bg-medusa-bg-component hover:!bg-medusa-bg-component-hover",
        "hover:!bg-medusa-bg-component-hover animation-fill-forwards",
        "opacity-0"
      )}
      iconClassName={clsx(
        "!shadow-none border-[0.5px] border-medusa-alphas-alpha-250"
      )}
      cardRef={cardRef}
    />
  )
}
