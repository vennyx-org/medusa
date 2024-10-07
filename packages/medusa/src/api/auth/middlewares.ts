import { authenticate, MiddlewareRoute } from "@medusajs/framework/http"
import { validateScopeProviderAssociation } from "./utils/validate-scope-provider-association"
import { validateToken } from "./utils/validate-token"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", "bearer")],
  },
  {
    method: ["DELETE"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", ["session"])],
  },
  {
    method: ["POST"],
    matcher: "/auth/token/refresh",
    middlewares: [authenticate("*", "bearer", { allowUnregistered: true })],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/callback",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/register",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["GET"],
    matcher: "/auth/:actor_type/:auth_provider",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/reset-password",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/update",
    middlewares: [validateScopeProviderAssociation(), validateToken()],
  },
]
