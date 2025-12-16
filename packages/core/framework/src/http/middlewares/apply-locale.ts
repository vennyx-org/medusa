import { ContainerRegistrationKeys, normalizeLocale } from "@medusajs/utils"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../types"

const CONTENT_LANGUAGE_HEADER = "content-language"

/**
 * Middleware that resolves the locale for the current request.
 *
 * Resolution order:
 * 1. Query parameter `?locale=en-US`
 * 2. Content-Language header
 *
 * The resolved locale is set on `req.locale`.
 */
export async function applyLocale(
  req: MedusaRequest,
  _: MedusaResponse,
  next: MedusaNextFunction
) {
  // 1. Check query parameter
  const queryLocale = req.query.locale as string | undefined
  if (queryLocale) {
    req.locale = normalizeLocale(queryLocale)
    return next()
  }

  // 2. Check Content-Language header
  const headerLocale = req.get(CONTENT_LANGUAGE_HEADER)
  if (headerLocale) {
    req.locale = normalizeLocale(headerLocale)
    return next()
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [store],
  } = await query.graph(
    {
      entity: "store",
      fields: ["id", "supported_locales"],
      pagination: {
        take: 1,
      },
    },
    {
      cache: {
        enable: true,
      },
    }
  )

  if (store?.supported_locales?.length) {
    req.locale = store.supported_locales.find(
      (locale) => locale.is_default
    )?.locale_code
    return next()
  }

  return next()
}
