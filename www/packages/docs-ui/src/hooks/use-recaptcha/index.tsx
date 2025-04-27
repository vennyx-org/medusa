"use client"

// NOTE: This was shared by Kapa team with minor modifications.

import { useEffect, useState, useCallback } from "react"
import { useIsBrowser } from "../../providers"

/**
 * Helper to execute a Promise with a timeout
 */
export async function executeWithTimeout<T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Promise timed out."))
    }, timeout)

    promise
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        execute: (id: string, action: { action: string }) => Promise<string>
        ready: (callback: () => void) => void
      }
    }
  }
}

const RECAPTCHA_SCRIPT_ID = "kapa-recaptcha-script"

/**
 * Recaptcha action types to classify recaptcha assessments.
 * IMPORTANT: Make sure these match the ones on the widget-proxy
 */
export enum RecaptchaAction {
  AskAi = "ask_ai", // for /chat (/query) routes
  FeedbackSubmit = "feedback_submit", // for /feedback routes
  Search = "search", // for /search routes
}

type UseRecaptchaProps = {
  siteKey: string
}

/**
 * This hook loads the reCAPTCHA SDK and exposes the "grecaptcha.execute" function
 * which returns a recpatcha token. The token must then be validated on the backend.
 * We use a reCAPTCHA Enterprise Score-based key, which is returning a score when
 * calling the reCAPTCHA Enterprise API with the returned token from the `execute`
 * call. The score indicates the probability of the request being made by a human.
 * @param siteKey the reCAPTCHA (enterprise) site key
 * @param loadScript boolean flag to load the reCAPTCHA script
 */
export const useRecaptcha = ({ siteKey }: UseRecaptchaProps) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  // The recaptcha execute function is not immediately
  // ready so we need to wait until we can call it.
  const [isExecuteReady, setIsExecuteReady] = useState(false)
  const { isBrowser } = useIsBrowser()

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    if (document.getElementById(RECAPTCHA_SCRIPT_ID)) {
      setIsScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.id = RECAPTCHA_SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`
    script.async = true
    script.defer = true

    const handleLoad = () => {
      setIsScriptLoaded(true)
    }
    const handleError = (event: Event) => {
      console.error("Failed to load reCAPTCHA Enterprise script", event)
    }

    script.addEventListener("load", handleLoad)
    script.addEventListener("error", handleError)

    document.head.appendChild(script)

    return () => {
      if (script) {
        script.removeEventListener("load", handleLoad)
        script.removeEventListener("error", handleError)
        document.head.removeChild(script)
      }
    }
  }, [siteKey, isBrowser])

  useEffect(() => {
    if (isScriptLoaded && window.grecaptcha) {
      try {
        window.grecaptcha.enterprise.ready(() => {
          setIsExecuteReady(true)
        })
      } catch (error) {
        console.error("Error during reCAPTCHA ready initialization:", error)
      }
    }
  }, [isScriptLoaded])

  useEffect(() => {
    if (!isExecuteReady) {
      return
    }

    const recaptchaElm = document.querySelector(".grecaptcha-badge")
    if (recaptchaElm?.parentElement) {
      recaptchaElm.parentElement.classList.add("absolute")
    }
  }, [isExecuteReady])

  const execute = useCallback(
    async (actionName: RecaptchaAction): Promise<string> => {
      if (!isExecuteReady) {
        console.error("reCAPTCHA is not ready")
        return ""
      }

      try {
        const token = await executeWithTimeout(
          window.grecaptcha.enterprise.execute(siteKey, {
            action: actionName,
          }),
          4000
        )
        return token
      } catch (error) {
        console.error("Error obtaining reCAPTCHA token:", error)
        return ""
      }
    },
    [isExecuteReady, siteKey]
  )

  return { execute }
}
