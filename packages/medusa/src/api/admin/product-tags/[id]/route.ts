import {
  deleteProductTagsWorkflow,
  updateProductTagsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import {
  AdminGetProductTagParamsType,
  AdminUpdateProductTagType,
} from "../validators"
import { refetchEntity } from "../../../utils/refetch-entity"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductTagParamsType>,
  res: MedusaResponse<HttpTypes.AdminProductTagResponse>
) => {
  const productTag = await refetchEntity(
    "product_tag",
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_tag: productTag })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductTagType>,
  res: MedusaResponse<HttpTypes.AdminProductTagResponse>
) => {
  const existingProductTag = await refetchEntity(
    "product_tag",
    req.params.id,
    req.scope,
    ["id"]
  )

  if (!existingProductTag) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product tag with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateProductTagsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const productTag = await refetchEntity(
    "product_tag",
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_tag: productTag })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductTagDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductTagsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product_tag",
    deleted: true,
  })
}
