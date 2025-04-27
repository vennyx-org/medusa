import {
  AdditionalData,
  BigNumberInput,
  FulfillmentDTO,
  InventoryItemDTO,
  OrderDTO,
  OrderLineItemDTO,
  OrderWorkflow,
  ProductVariantDTO,
  ReservationItemDTO,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
  OrderWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { cancelFulfillmentWorkflow } from "../../fulfillment"
import { adjustInventoryLevelsStep } from "../../inventory"
import { cancelOrderFulfillmentStep } from "../steps/cancel-fulfillment"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"
import { createReservationsStep } from "../../reservation"
import { updateReservationsStep } from "../../reservation"

type OrderItemWithVariantDTO = OrderLineItemDTO & {
  variant?: ProductVariantDTO & {
    inventory_items: {
      inventory: InventoryItemDTO
      variant_id: string
      inventory_item_id: string
      required_quantity: number
    }[]
  }
}

/**
 * The data to validate the order fulfillment cancelation.
 */
export type CancelOrderFulfillmentValidateOrderStep = {
  /**
   * The order to cancel the fulfillment for.
   */
  order: OrderDTO & {
    /**
     * The order's fulfillments.
     */
    fulfillments: FulfillmentDTO[]
  }
  /**
   * The cancelation details.
   */
  input: OrderWorkflow.CancelOrderFulfillmentWorkflowInput
}

/**
 * This step validates that an order fulfillment can be canceled. If
 * the fulfillment doesn't exist, or it has already been shipped, the step throws an error.
 *
 * :::note
 *
 * You can retrieve an order and fulfillment details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = cancelOrderFulfillmentValidateOrder({
 *   order: {
 *     id: "order_123",
 *     fulfillments: [
 *       {
 *         id: "ful_123",
 *         // other fulfillment details...
 *       }
 *     ]
 *     // other order details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *     fulfillment_id: "ful_123"
 *   }
 * })
 */
export const cancelOrderFulfillmentValidateOrder = createStep(
  "cancel-fulfillment-validate-order",
  ({ order, input }: CancelOrderFulfillmentValidateOrderStep) => {
    throwIfOrderIsCancelled({ order })

    const fulfillment = order.fulfillments.find(
      (f) => f.id === input.fulfillment_id
    )
    if (!fulfillment) {
      throw new Error(
        `Fulfillment with id ${input.fulfillment_id} not found in the order`
      )
    }

    if (fulfillment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The fulfillment is already canceled"
      )
    }

    if (fulfillment.shipped_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The fulfillment has already been shipped. Shipped fulfillments cannot be canceled`
      )
    }

    throwIfItemsDoesNotExistsInOrder({
      order,
      inputItems: fulfillment.items.map((i) => ({
        id: i.line_item_id as string,
        quantity: i.quantity,
      })),
    })
  }
)

function prepareCancelOrderFulfillmentData({
  order,
  fulfillment,
}: {
  order: OrderDTO
  fulfillment: FulfillmentDTO
}) {
  const lineItemIds = new Array(
    ...new Set(fulfillment.items.map((i) => i.line_item_id))
  )

  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: fulfillment.id,
    items: lineItemIds.map((lineItemId) => {
      // find order item
      const orderItem = order.items!.find(
        (i) => i.id === lineItemId
      ) as OrderItemWithVariantDTO
      // find inventory items
      const iitems = orderItem!.variant?.inventory_items
      // find fulfillment item
      const fitem = fulfillment.items.find(
        (i) => i.line_item_id === lineItemId
      )!

      let quantity: BigNumberInput = fitem.quantity

      // NOTE: if the order item has an inventory kit or `required_qunatity` > 1, fulfillment items wont't match 1:1 with order items.
      // - for each inventory item in the kit, a fulfillment item will be created i.e. one line item could have multiple fulfillment items
      // - the quantity of the fulfillment item will be the quantity of the order item multiplied by the required quantity of the inventory item
      //
      //   We need to take this into account when canceling the fulfillment to compute quantity of line items not being fulfilled based on fulfillment items and qunatities.
      //   NOTE: for now we only need to find one inventory item of a line item to compute this since when a fulfillment is created all inventory items are fulfilled together.
      //   If we allow to cancel partial fulfillments for an order item, we need to change this.

      if (iitems?.length) {
        const iitem = iitems.find(
          (i) => i.inventory.id === fitem.inventory_item_id
        )

        quantity = MathBN.div(quantity, iitem!.required_quantity)
      }

      return {
        id: lineItemId as string,
        quantity,
      }
    }),
  }
}

function prepareInventoryUpdate({
  fulfillment,
  reservations,
  order,
}: {
  fulfillment: FulfillmentDTO
  reservations: ReservationItemDTO[]
  order: any
}) {
  const inventoryAdjustment: {
    inventory_item_id: string
    location_id: string
    adjustment: BigNumberInput
  }[] = []
  const toCreate: {
    inventory_item_id: string
    location_id: string
    quantity: BigNumberInput
  }[] = []
  const toUpdate: {
    id: string
    quantity: BigNumberInput
  }[] = []

  const orderItemsMap = order.items!.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  const reservationMap = reservations.reduce((acc, reservation) => {
    acc[reservation.inventory_item_id as string] = reservation
    return acc
  }, {})

  for (const fulfillmentItem of fulfillment.items) {
    // if this is `null` this means that item is from variant that has `manage_inventory` false
    if (!fulfillmentItem.inventory_item_id) {
      continue
    }

    const orderItem = orderItemsMap[fulfillmentItem.line_item_id as string]

    orderItem?.variant?.inventory_items.forEach((iitem) => {
      const reservation =
        reservationMap[fulfillmentItem.inventory_item_id as string]

      if (!reservation) {
        toCreate.push({
          inventory_item_id: iitem.inventory.id,
          location_id: fulfillment.location_id,
          quantity: fulfillmentItem.quantity, // <- this is the inventory quantity that is being fulfilled so it menas it does include the required quantity
        })
      } else {
        toUpdate.push({
          id: reservation.id,
          quantity: reservation.quantity + fulfillmentItem.quantity,
        })
      }
    })

    inventoryAdjustment.push({
      inventory_item_id: fulfillmentItem.inventory_item_id as string,
      location_id: fulfillment.location_id,
      adjustment: fulfillmentItem.quantity,
    })
  }

  return {
    toCreate,
    toUpdate,
    inventoryAdjustment,
  }
}

/**
 * The data to cancel an order's fulfillment, along with custom data that's passed to the workflow's hooks.
 */
export type CancelOrderFulfillmentWorkflowInput =
  OrderWorkflow.CancelOrderFulfillmentWorkflowInput & AdditionalData

export const cancelOrderFulfillmentWorkflowId = "cancel-order-fulfillment"
/**
 * This workflow cancels an order's fulfillment. It's used by the [Cancel Order's Fulfillment Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idcancel).
 *
 * This workflow has a hook that allows you to perform custom actions on the canceled fulfillment. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the fulfillment.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around canceling a fulfillment.
 *
 * @example
 * const { result } = await cancelOrderFulfillmentWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     fulfillment_id: "ful_123",
 *     additional_data: {
 *       reason: "Customer changed their mind"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Cancel an order's fulfillment.
 *
 * @property hooks.orderFulfillmentCanceled - This hook is executed after the fulfillment is canceled. You can consume this hook to perform custom actions on the canceled fulfillment.
 */
export const cancelOrderFulfillmentWorkflow = createWorkflow(
  cancelOrderFulfillmentWorkflowId,
  (input: WorkflowData<CancelOrderFulfillmentWorkflowInput>) => {
    const order: OrderDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "orders",
        fields: [
          "id",
          "status",
          "items.id",
          "items.quantity",
          "items.variant.manage_inventory",
          "items.variant.inventory_items.inventory.id",
          "items.variant.inventory_items.required_quantity",
          "fulfillments.id",
          "fulfillments.location_id",
          "fulfillments.items.id",
          "fulfillments.items.quantity",
          "fulfillments.items.line_item_id",
          "fulfillments.items.inventory_item_id",
        ],
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      })

    cancelOrderFulfillmentValidateOrder({ order, input })

    const fulfillment = transform({ input, order }, ({ input, order }) => {
      return order.fulfillments.find((f) => f.id === input.fulfillment_id)!
    })

    const lineItemIds = transform({ fulfillment }, ({ fulfillment }) => {
      return fulfillment.items.map((i) => i.line_item_id)
    })

    const reservations = useRemoteQueryStep({
      entry_point: "reservations",
      fields: [
        "id",
        "line_item_id",
        "quantity",
        "inventory_item_id",
        "location_id",
      ],
      variables: {
        filter: {
          line_item_id: lineItemIds,
        },
      },
    }).config({ name: "get-reservations" })

    const cancelOrderFulfillmentData = transform(
      { order, fulfillment },
      prepareCancelOrderFulfillmentData
    )

    const { toCreate, toUpdate, inventoryAdjustment } = transform(
      { order, fulfillment, reservations },
      prepareInventoryUpdate
    )

    adjustInventoryLevelsStep(inventoryAdjustment)

    const eventData = transform({ order, fulfillment, input }, (data) => {
      return {
        order_id: data.order.id,
        fulfillment_id: data.fulfillment.id,
        no_notification: data.input.no_notification,
      }
    })

    parallelize(
      cancelOrderFulfillmentStep(cancelOrderFulfillmentData),
      createReservationsStep(toCreate),
      updateReservationsStep(toUpdate),
      emitEventStep({
        eventName: OrderWorkflowEvents.FULFILLMENT_CANCELED,
        data: eventData,
      })
    )

    // last step because there is no compensation for this step
    cancelFulfillmentWorkflow.runAsStep({
      input: {
        id: input.fulfillment_id,
      },
    })

    const orderFulfillmentCanceled = createHook("orderFulfillmentCanceled", {
      fulfillment,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(void 0, {
      hooks: [orderFulfillmentCanceled],
    })
  }
)
