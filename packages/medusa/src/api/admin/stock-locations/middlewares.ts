import { MiddlewareRoute } from "@medusajs/framework/http"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreateStockLocation,
  AdminCreateStockLocationFulfillmentSet,
  AdminGetStockLocationParams,
  AdminGetStockLocationsParams,
  AdminUpdateStockLocation,
} from "./validators"

export const adminStockLocationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/stock-locations",
    middlewares: [
      validateAndTransformBody(AdminCreateStockLocation),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStockLocationsParams,
        QueryConfig.listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "sales_channel_location",
        resourceId: "stock_location_id",
        filterableField: "sales_channel_id",
      }),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateStockLocation),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/fulfillment-sets",
    middlewares: [
      validateAndTransformBody(AdminCreateStockLocationFulfillmentSet),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/sales-channels",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/fulfillment-providers",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
