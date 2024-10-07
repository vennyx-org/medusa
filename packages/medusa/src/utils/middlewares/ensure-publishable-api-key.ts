import {
  MedusaNextFunction,
  MedusaResponse,
  MedusaStoreRequest,
} from "@medusajs/framework/http"
import {
  ApiKeyType,
  isPresent,
  MedusaError,
  PUBLISHABLE_KEY_HEADER,
} from "@medusajs/framework/utils"
import { refetchEntity } from "../../api/utils/refetch-entity"

export function ensurePublishableApiKey() {
  return async (
    req: MedusaStoreRequest,
    _res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const publishableApiKey = req.get("x-publishable-api-key")

    if (!isPresent(publishableApiKey)) {
      try {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Publishable API key required in the request header: ${PUBLISHABLE_KEY_HEADER}. You can manage your keys in settings in the dashboard.`
        )
      } catch (e) {
        return next(e)
      }
    }

    // TODO: Replace this with the fancy new gql fetch
    const apiKey = await refetchEntity(
      "api_key",
      {
        token: publishableApiKey,
        type: ApiKeyType.PUBLISHABLE,
        $or: [
          { revoked_at: { $eq: null } },
          { revoked_at: { $gt: new Date() } },
        ],
      },
      req.scope,
      ["id", "token", "sales_channels_link.sales_channel_id"]
    )

    if (!apiKey) {
      try {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `A valid publishable key is required to proceed with the request`
        )
      } catch (e) {
        return next(e)
      }
    }

    req.publishable_key_context = {
      key: apiKey.token,
      sales_channel_ids: apiKey.sales_channels_link.map(
        (link) => link.sales_channel_id
      ),
    }

    return next()
  }
}
