import { MiddlewareRoute } from "@medusajs/framework/http"
import { storeReturnsRoutesMiddlewares } from "./returns/middlewares"

export const storeRoutesMiddlewares: MiddlewareRoute[] = [
  ...storeReturnsRoutesMiddlewares,
]
