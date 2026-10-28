import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import {
  AdminAddRolePoliciesType,
  AdminCreateRbacRole,
  AdminGetRbacRoleParams,
  AdminGetRbacRolesParams,
  AdminUpdateRbacRole,
} from "./validators"

export const adminRbacRoleRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacRolesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles",
    middlewares: [
      validateAndTransformBody(AdminCreateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles/:id/policies",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveRolePoliciesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles/:id/policies",
    middlewares: [
      validateAndTransformBody(AdminAddRolePoliciesType),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveRolePoliciesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/roles/:id/policies/:policy_id",
    middlewares: [],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/roles/:id",
    middlewares: [],
  },
]
