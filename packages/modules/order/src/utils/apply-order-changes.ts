import { OrderChangeActionDTO } from "@medusajs/types"
import {
  ChangeActionType,
  MathBN,
  createRawPropertiesFromBigNumber,
  isDefined,
} from "@medusajs/utils"
import { OrderItem, OrderShippingMethod } from "@models"
import { calculateOrderChange } from "./calculate-order-change"

export interface ApplyOrderChangeDTO extends OrderChangeActionDTO {
  id: string
  order_id: string
  version: number
  applied: boolean
}

export function applyChangesToOrder(
  orders: any[],
  actionsMap: Record<string, any[]>,
  options?: {
    addActionReferenceToObject?: boolean
  }
) {
  const itemsToUpsert: OrderItem[] = []
  const shippingMethodsToUpsert: OrderShippingMethod[] = []
  const summariesToUpsert: any[] = []
  const orderToUpdate: any[] = []

  const calculatedOrders = {}
  for (const order of orders) {
    const calculated = calculateOrderChange({
      order: order as any,
      actions: actionsMap[order.id],
      transactions: order.transactions ?? [],
      options,
    })

    createRawPropertiesFromBigNumber(calculated)

    calculatedOrders[order.id] = calculated

    const version = actionsMap[order.id]?.[0]?.version ?? order.version

    for (const item of calculated.order.items) {
      if (MathBN.lte(item.quantity, 0)) {
        continue
      }

      const isExistingItem = item.id === item.detail?.item_id
      const orderItem = isExistingItem ? (item.detail as any) : item
      const itemId = isExistingItem ? orderItem.item_id : item.id

      itemsToUpsert.push({
        id: orderItem.version === version ? orderItem.id : undefined,
        item_id: itemId,
        order_id: order.id,
        version,
        quantity: orderItem.quantity,
        fulfilled_quantity: orderItem.fulfilled_quantity ?? 0,
        delivered_quantity: orderItem.delivered_quantity ?? 0,
        shipped_quantity: orderItem.shipped_quantity ?? 0,
        return_requested_quantity: orderItem.return_requested_quantity ?? 0,
        return_received_quantity: orderItem.return_received_quantity ?? 0,
        return_dismissed_quantity: orderItem.return_dismissed_quantity ?? 0,
        written_off_quantity: orderItem.written_off_quantity ?? 0,
        metadata: orderItem.metadata,
      } as OrderItem)
    }

    const orderSummary = order.summary as any
    summariesToUpsert.push({
      id: orderSummary?.version === version ? orderSummary.id : undefined,
      order_id: order.id,
      version,
      totals: calculated.summary,
    })

    if (version > order.version) {
      for (const shippingMethod of calculated.order.shipping_methods ?? []) {
        const shippingMethod_ = shippingMethod as any
        const isNewShippingMethod = !isDefined(shippingMethod_?.detail)
        if (!shippingMethod_) {
          continue
        }

        let associatedMethodId
        let hasShippingMethod = false
        if (isNewShippingMethod) {
          associatedMethodId = shippingMethod_.actions?.find((sm) => {
            return (
              sm.action === ChangeActionType.SHIPPING_ADD && sm.reference_id
            )
          })
          hasShippingMethod = !!associatedMethodId
        } else {
          associatedMethodId = shippingMethod_?.detail?.shipping_method_id
        }

        const sm = {
          ...(isNewShippingMethod ? shippingMethod_ : shippingMethod_.detail),
          version,
          shipping_method_id: associatedMethodId,
        } as any

        delete sm.id

        if (!hasShippingMethod) {
          shippingMethodsToUpsert.push(sm)
        }
      }

      orderToUpdate.push({
        selector: {
          id: order.id,
        },
        data: {
          version,
        },
      })
    }
  }

  return {
    itemsToUpsert,
    shippingMethodsToUpsert,
    summariesToUpsert,
    orderToUpdate,
    calculatedOrders,
  }
}
