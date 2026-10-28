import { Button, toast } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { decodeToken } from "react-jwt"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useCreateCloudAuthUser } from "../../../hooks/api/cloud"
import { sdk } from "../../../lib/client"

const CLOUD_AUTH_PROVIDER = "cloud"

export const CloudAuthLogin = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const { handleCallback, isCallbackPending } = useAuthCallback(searchParams)

  // Check if we're returning from the OAuth callback
  const hasCallbackParams =
    searchParams.get("auth_provider") === CLOUD_AUTH_PROVIDER &&
    searchParams.has("code") &&
    searchParams.has("state")

  const callbackInitiated = useRef(false) // ref to prevent duplicate calls in React strict mode and other unmounting+mounting scenarios
  useEffect(() => {
    if (hasCallbackParams && !callbackInitiated.current) {
      callbackInitiated.current = true
      handleCallback()
    }
  }, [hasCallbackParams, handleCallback])

  const handleCloudLogin = async () => {
    try {
      const result = await sdk.auth.login("user", CLOUD_AUTH_PROVIDER, {
        // in case the admin is on a different domain, or the backend URL is set to just "/" which won't work for the callback
        callback_url: `${window.location.origin}${window.location.pathname}?auth_provider=${CLOUD_AUTH_PROVIDER}`,
      })

      if (typeof result === "object" && result.location) {
        // Redirect to Medusa Cloud for authentication
        window.location.href = result.location
        return
      }

      throw new Error("Unexpected login response")
    } catch {
      toast.error(t("auth.login.authenticationFailed"))
    }
  }

  return (
    <>
      <hr className="bg-ui-border-base my-4" />
      <Button
        variant="secondary"
        onClick={handleCloudLogin}
        className="w-full"
        disabled={isCallbackPending}
        isLoading={isCallbackPending}
      >
        {t("auth.login.cloud")}
      </Button>
    </>
  )
}

const useAuthCallback = (searchParams: URLSearchParams) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync: createCloudAuthUser } = useCreateCloudAuthUser()

  const { mutateAsync: handleCallback, isPending: isCallbackPending } =
    useMutation({
      mutationFn: async () => {
        let token: string
        try {
          const query = Object.fromEntries(searchParams)
          delete query.auth_provider // BE doesn't need this

          token = await sdk.auth.callback("user", CLOUD_AUTH_PROVIDER, query)
        } catch (error) {
          throw new Error("Authentication callback failed")
        }

        const decodedToken = decodeToken(token) as {
          actor_id: string
          user_metadata: Record<string, unknown>
        }

        // If user doesn't exist, create it
        if (!decodedToken?.actor_id) {
          await createCloudAuthUser()

          // Refresh token to get the updated token with actor_id
          const refreshedToken = await sdk.auth.refresh({
            Authorization: `Bearer ${token}`, // passing it manually in case the auth type is session
          })
          if (!refreshedToken) {
            throw new Error("Failed to refresh token after user creation")
          }
        }

        return true
      },
      onSuccess: () => {
        navigate("/")
      },
      onError: () => {
        toast.error(t("auth.login.authenticationFailed"))
      },
    })

  return { handleCallback, isCallbackPending }
}
