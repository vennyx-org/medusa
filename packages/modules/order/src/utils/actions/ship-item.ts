import {
  ChangeActionType,
  MathBN,
  MedusaError,
} from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.SHIP_ITEM, {
  operation({ action, currentOrder, options }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.shipped_quantity ??= 0

    existing.detail.shipped_quantity = MathBN.add(
      existing.detail.shipped_quantity,
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
        `Quantity to ship of item ${refId} is required.`
      )
    }

    if (MathBN.lt(action.details?.quantity, 1)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} must be greater than 0.`
      )
    }

    const notShipped = MathBN.sub(
      existing.detail?.fulfilled_quantity,
      existing.detail?.shipped_quantity
    )

    const greater = MathBN.gt(action.details?.quantity, notShipped)
    if (greater) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot ship more items than what was fulfilled for item ${refId}.`
      )
    }
  },
})
