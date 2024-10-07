import {
  BigNumber,
  ChangeActionType,
  MathBN,
  MedusaError,
} from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_UPDATE, {
  operation({ action, currentOrder, options }) {
    const existingIndex = currentOrder.items.findIndex(
      (item) => item.id === action.details.reference_id
    )

    const existing = currentOrder.items[existingIndex]

    existing.detail.quantity ??= 0

    const quantityDiff = MathBN.sub(
      action.details.quantity,
      existing.detail.quantity
    )

    const quant = new BigNumber(action.details.quantity)
    existing.quantity = quant
    existing.detail.quantity = quant

    setActionReference(existing, action, options)

    return MathBN.mult(existing.unit_price, quantityDiff)
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

    if (action.details?.quantity == null) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} is required.`
      )
    }

    action.details.quantity ??= 0

    const lower = MathBN.lt(
      action.details.quantity,
      existing.detail?.fulfilled_quantity
    )

    if (lower) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Item ${refId} has already been fulfilled and quantity cannot be lower than ${existing.detail?.fulfilled_quantity}.`
      )
    }
  },
})
