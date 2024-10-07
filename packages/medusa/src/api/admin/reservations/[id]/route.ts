import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  AdminGetReservationParamsType,
  AdminUpdateReservationType,
} from "../validators"
import { MedusaError } from "@medusajs/framework/utils"
import {
  deleteReservationsWorkflow,
  updateReservationsWorkflow,
} from "@medusajs/core-flows"
import { refetchReservation } from "../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetReservationParamsType>,
  res: MedusaResponse<HttpTypes.AdminReservationResponse>
) => {
  const { id } = req.params

  const reservation = await refetchReservation(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!reservation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Reservation with id: ${id} was not found`
    )
  }

  res.status(200).json({ reservation })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateReservationType>,
  res: MedusaResponse<HttpTypes.AdminReservationResponse>
) => {
  const { id } = req.params
  await updateReservationsWorkflow(req.scope).run({
    input: {
      updates: [{ ...req.validatedBody, id }],
    },
  })

  const reservation = await refetchReservation(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ reservation })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminReservationDeleteResponse>
) => {
  const id = req.params.id

  await deleteReservationsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "reservation",
    deleted: true,
  })
}
