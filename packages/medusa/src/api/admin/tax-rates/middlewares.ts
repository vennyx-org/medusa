import * as QueryConfig from "./query-config"

import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateTaxRate,
  AdminCreateTaxRateRule,
  AdminGetTaxRateParams,
  AdminGetTaxRatesParams,
  AdminUpdateTaxRate,
} from "./validators"

import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformBody } from "../../utils/validate-body"

export const adminTaxRateRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "POST",
    matcher: "/admin/tax-rates",
    middlewares: [
      validateAndTransformBody(AdminCreateTaxRate),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateTaxRate),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-rates",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRatesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id/rules",
    middlewares: [
      validateAndTransformBody(AdminCreateTaxRateRule),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "DELETE",
    matcher: "/admin/tax-rates/:id/rules/:rule_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
