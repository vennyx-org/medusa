import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const CustomPostSchema = z.object({
  foo: z.string(),
})

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/custom",
      middlewares: [validateAndTransformBody(CustomPostSchema)],
    },
  ],
})
