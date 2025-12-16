import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils/middlewares"
import { createBatchBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreatePriceList,
  AdminCreatePriceListPrice,
  AdminGetPriceListParams,
  AdminGetPriceListPriceParams,
  AdminGetPriceListPricesParams,
  AdminGetPriceListsParams,
  AdminRemoveProductsPriceList,
  AdminUpdatePriceList,
  AdminUpdatePriceListPrice,
} from "./validators"

export const adminPriceListsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.listPriceListQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformBody(AdminCreatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/products",
    middlewares: [
      validateAndTransformBody(AdminRemoveProductsPriceList),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.listPriceListQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id/prices",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/prices/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      validateAndTransformBody(
        createBatchBody(AdminCreatePriceListPrice, AdminUpdatePriceListPrice)
      ),
      validateAndTransformQuery(
        AdminGetPriceListPriceParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
  },
]
