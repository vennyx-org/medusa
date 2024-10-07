import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreateCustomerGroup,
  AdminGetCustomerGroupParams,
  AdminGetCustomerGroupsParams,
  AdminUpdateCustomerGroup,
} from "./validators"

export const adminCustomerGroupRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/customer-groups",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCustomerGroupsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups",
    middlewares: [
      validateAndTransformBody(AdminCreateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
