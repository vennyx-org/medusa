import * as QueryConfig from "./query-config"

import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  AdminCreateApiKey,
  AdminGetApiKeyParams,
  AdminGetApiKeysParams,
  AdminRevokeApiKey,
  AdminUpdateApiKey,
} from "./validators"
import { createLinkBody } from "../../utils/validators"

export const adminApiKeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/api-keys",
    middlewares: [
      validateAndTransformQuery(
        AdminGetApiKeysParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys",
    middlewares: [
      validateAndTransformBody(AdminCreateApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: [
      validateAndTransformBody(AdminRevokeApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/sales-channels",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
