import multer from "multer"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformQuery } from "@medusajs/framework"
import { retrieveUploadConfig } from "./query-config"
import { AdminGetUploadParams } from "./validators"

// TODO: For now we keep the files in memory, as that's how they get passed to the workflows
// This will need revisiting once we are closer to prod-ready v2, since with workflows and potentially
// services on other machines using streams is not as simple as it used to be.
const upload = multer({ storage: multer.memoryStorage() })

export const adminUploadRoutesMiddlewares: MiddlewareRoute[] = [
  // TODO: There is a `/protected` route in v1 that might need a bit more thought when implementing
  {
    method: ["POST"],
    matcher: "/admin/uploads",
    middlewares: [
      upload.array("files"),
      validateAndTransformQuery(AdminGetUploadParams, retrieveUploadConfig),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/uploads/:id",
    middlewares: [
      validateAndTransformQuery(AdminGetUploadParams, retrieveUploadConfig),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/uploads/:id",
    middlewares: [],
  },
]
