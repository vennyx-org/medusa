import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import * as queryConfig from "./query-config"
import {
  AdminCreatePaymentRefundReason,
  AdminGetRefundReasonsParams,
  AdminUpdatePaymentRefundReason,
} from "./validators"

export const adminRefundReasonsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/refund-reasons",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/refund-reasons",
    middlewares: [
      validateAndTransformBody(AdminCreatePaymentRefundReason),
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePaymentRefundReason),
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
