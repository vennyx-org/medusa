import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { deleteFilesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { remoteQueryObjectFromString } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminFileResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "file",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [file] = await remoteQuery(queryObject)
  if (!file) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `File with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ file })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminFileDeleteResponse>
) => {
  const id = req.params.id

  await deleteFilesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "file",
    deleted: true,
  })
}
