import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminPostCancelReturnReqSchema,
  AdminPostReceiveReturnItemsReqSchema,
  AdminPostReceiveReturnsReqSchema,
  AdminPostReturnsConfirmRequestReqSchema,
  AdminPostReturnsReqSchema,
  AdminPostReturnsRequestItemsActionReqSchema,
  AdminPostReturnsRequestItemsReqSchema,
  AdminPostReturnsReturnReqSchema,
  AdminPostReturnsShippingActionReqSchema,
  AdminPostReturnsShippingReqSchema,
} from "./validators"

export const adminReturnRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/returns",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/returns/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsReturnReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/request-items",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsRequestItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/request-items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/request-items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/request",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsConfirmRequestReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/cancel",
    middlewares: [
      validateAndTransformBody(AdminPostCancelReturnReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/request",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive",
    middlewares: [
      validateAndTransformBody(AdminPostReceiveReturnsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/receive",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive/confirm",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsConfirmRequestReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive-items",
    middlewares: [
      validateAndTransformBody(AdminPostReceiveReturnItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive-items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/receive-items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/dismiss-items",
    middlewares: [
      validateAndTransformBody(AdminPostReceiveReturnItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/dismiss-items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostReturnsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/dismiss-items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
