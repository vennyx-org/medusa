import {
  ChangeActionType,
  MathBN,
  MedusaError,
} from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.FULFILL_ITEM, {
  operation({ action, currentOrder, options }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.fulfilled_quantity ??= 0

    existing.detail.fulfilled_quantity = MathBN.add(
      existing.detail.fulfilled_quantity,
      action.details.quantity
    )

    setActionReference(existing, action, options)
  },
  validate({ action, currentOrder }) {
    const refId = action.details?.reference_id
    if (refId == null) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

    const existing = currentOrder.items.find((item) => item.id === refId)
    if (!existing) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Item ID "${refId}" not found.`
      )
    }

    if (!action.details?.quantity) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity to fulfill of item ${refId} is required.`
      )
    }

    if (action.details?.quantity < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} must be greater than 0.`
      )
    }

    const notFulfilled = MathBN.sub(
      existing.quantity,
      existing.detail?.fulfilled_quantity
    )
    const greater = MathBN.gt(action.details?.quantity, notFulfilled)
    if (greater) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot fulfill more items than what was ordered for item ${refId}.`
      )
    }
  },
})
