import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  AdminBatchTranslations,
  AdminGetTranslationsParams,
} from "./validators"
import * as QueryConfig from "./query-config"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils"

export const adminTranslationsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/translations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTranslationsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/translations/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [validateAndTransformBody(AdminBatchTranslations)],
  },
]
