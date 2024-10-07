import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { listTransformQueryConfig } from "./query-config"
import { StoreGetShippingOptions } from "./validators"

export const storeShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        StoreGetShippingOptions,
        listTransformQueryConfig
      ),
    ],
  },
]
