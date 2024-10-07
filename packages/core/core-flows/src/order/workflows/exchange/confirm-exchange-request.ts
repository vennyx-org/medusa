import {
  FulfillmentWorkflow,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderExchangeItemDTO,
  OrderPreviewDTO,
  OrderReturnItemDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  MedusaError,
  Modules,
  OrderChangeStatus,
  ReturnStatus,
} from "@medusajs/framework/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { reserveInventoryStep } from "../../../cart/steps/reserve-inventory"
import { prepareConfirmInventoryInput } from "../../../cart/utils/prepare-confirm-inventory-input"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment/workflows/create-return-fulfillment"
import { previewOrderChangeStep, updateReturnsStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createOrderExchangeItemsFromActionsStep } from "../../steps/exchange/create-exchange-items-from-actions"
import { createReturnItemsFromActionsStep } from "../../steps/return/create-return-items-from-actions"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrUpdateOrderPaymentCollectionWorkflow } from "../create-or-update-order-payment-collection"

export type ConfirmExchangeRequestWorkflowInput = {
  exchange_id: string
  confirmed_by?: string
}

/**
 * This step validates that a requested exchange can be confirmed.
 */
export const confirmExchangeRequestValidationStep = createStep(
  "validate-confirm-exchange-request",
  async function ({
    order,
    orderChange,
    orderExchange,
  }: {
    order: OrderDTO
    orderExchange: OrderExchangeDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * This step confirms that a requested exchange has at least one item to return or send
 */
const confirmIfExchangeItemsArePresent = createStep(
  "confirm-if-exchange-items-are-present",
  async function ({
    exchangeItems,
    returnItems,
  }: {
    exchangeItems: OrderExchangeItemDTO[]
    returnItems?: OrderReturnItemDTO[]
  }) {
    if (exchangeItems.length > 0 && (returnItems || []).length > 0) {
      return
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Order exchange request should have at least 1 item inbound and 1 item outbound`
    )
  }
)

function prepareFulfillmentData({
  order,
  items,
  shippingOption,
  deliveryAddress,
}: {
  order: OrderDTO
  items: any[]
  shippingOption: {
    id: string
    provider_id: string
    service_zone: {
      fulfillment_set: {
        location?: {
          id: string
          address: Record<string, any>
        }
      }
    }
  }
  deliveryAddress?: Record<string, any>
}) {
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )
  const fulfillmentItems = items.map((i) => {
    const orderItem = orderItemsMap.get(i.id) ?? i.item
    return {
      line_item_id: i.item_id,
      quantity: i.quantity,
      title: orderItem.variant_title ?? orderItem.title,
      sku: orderItem.variant_sku || "",
      barcode: orderItem.variant_barcode || "",
    } as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO
  })

  const locationId = shippingOption.service_zone.fulfillment_set.location?.id!

  // delivery address is the stock location address
  const address =
    deliveryAddress ??
    shippingOption.service_zone.fulfillment_set.location?.address ??
    {}

  delete address.id

  return {
    input: {
      location_id: locationId,
      provider_id: shippingOption.provider_id,
      shipping_option_id: shippingOption.id,
      items: fulfillmentItems,
      delivery_address: address,
      order: order,
    },
  }
}

function transformActionsToItems({ orderChange }) {
  const exchangeItems: OrderChangeActionDTO[] = []
  const returnItems: OrderChangeActionDTO[] = []

  const actions = orderChange.actions ?? []
  actions.forEach((item) => {
    if (item.action === ChangeActionType.RETURN_ITEM) {
      returnItems.push(item)
    } else if (item.action === ChangeActionType.ITEM_ADD) {
      exchangeItems.push(item)
    }
  })

  return {
    exchangeItems: {
      changes: exchangeItems,
      exchangeId: exchangeItems?.[0]?.exchange_id!,
    },
    returnItems: {
      changes: returnItems,
      returnId: returnItems?.[0]?.return_id!,
    },
  }
}

function extractShippingOption({ orderPreview, orderExchange, returnId }) {
  if (!orderPreview.shipping_methods?.length) {
    return
  }

  let returnShippingMethod
  let exchangeShippingMethod
  for (const shippingMethod of orderPreview.shipping_methods) {
    const modifiedShippingMethod_ = shippingMethod as any
    if (!modifiedShippingMethod_.actions) {
      continue
    }

    for (const action of modifiedShippingMethod_.actions) {
      if (action.action === ChangeActionType.SHIPPING_ADD) {
        if (action.return_id === returnId) {
          returnShippingMethod = shippingMethod
        } else if (action.exchange_id === orderExchange.id) {
          exchangeShippingMethod = shippingMethod
        }
      }
    }
  }

  return {
    returnShippingMethod,
    exchangeShippingMethod,
  }
}

export const confirmExchangeRequestWorkflowId = "confirm-exchange-request"
/**
 * This workflow confirms an exchange request.
 */
export const confirmExchangeRequestWorkflow = createWorkflow(
  confirmExchangeRequestWorkflowId,
  function (
    input: ConfirmExchangeRequestWorkflowInput
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange: OrderExchangeDTO = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "version",
        "canceled_at",
        "items.*",
        "items.item.id",
        "shipping_address.*",
      ],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.exchange_id",
        "actions.return_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    confirmExchangeRequestValidationStep({ order, orderExchange, orderChange })

    const { exchangeItems, returnItems } = transform(
      { orderChange },
      transformActionsToItems
    )

    const orderPreview = previewOrderChangeStep(order.id)

    const [createdExchangeItems, createdReturnItems] = parallelize(
      createOrderExchangeItemsFromActionsStep(exchangeItems),
      createReturnItemsFromActionsStep(returnItems)
    )

    confirmIfExchangeItemsArePresent({
      exchangeItems: createdExchangeItems,
      returnItems: createdReturnItems,
    })

    confirmOrderChanges({ changes: [orderChange], orderId: order.id })

    const returnId = transform(
      { createdReturnItems },
      ({ createdReturnItems }) => {
        return createdReturnItems?.[0]?.return_id
      }
    )

    when({ returnId }, ({ returnId }) => {
      return !!returnId
    }).then(() => {
      updateReturnsStep([
        {
          id: returnId,
          status: ReturnStatus.REQUESTED,
          requested_at: new Date(),
        },
      ])
    })

    const exchangeId = transform(
      { createdExchangeItems },
      ({ createdExchangeItems }) => {
        return createdExchangeItems?.[0]?.exchange_id
      }
    )

    const { returnShippingMethod, exchangeShippingMethod } = transform(
      { orderPreview, orderExchange, returnId },
      extractShippingOption
    )

    when({ exchangeShippingMethod }, ({ exchangeShippingMethod }) => {
      return !!exchangeShippingMethod
    }).then(() => {
      const exchange: OrderExchangeDTO = useRemoteQueryStep({
        entry_point: "order_exchange",
        fields: [
          "id",
          "version",
          "canceled_at",
          "order.sales_channel_id",
          "additional_items.quantity",
          "additional_items.raw_quantity",
          "additional_items.item.id",
          "additional_items.item.variant.manage_inventory",
          "additional_items.item.variant.allow_backorder",
          "additional_items.item.variant.inventory_items.inventory_item_id",
          "additional_items.item.variant.inventory_items.required_quantity",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.id",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.name",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
        ],
        variables: { id: exchangeId },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "exchange-query" })

      const { variants, items } = transform({ exchange }, ({ exchange }) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        exchange.additional_items.forEach((exchangeItem) => {
          const item = exchangeItem.item
          allItems.push({
            id: item.id,
            variant_id: item.variant_id,
            quantity: exchangeItem.raw_quantity ?? exchangeItem.quantity,
          })
          allVariants.push(item.variant)
        })

        return {
          variants: allVariants,
          items: allItems,
        }
      })

      const formatedInventoryItems = transform(
        {
          input: {
            sales_channel_id: (exchange as any).order.sales_channel_id,
            variants,
            items,
          },
        },
        prepareConfirmInventoryInput
      )

      reserveInventoryStep(formatedInventoryItems)
    })

    when(
      { returnShippingMethod, returnId },
      ({ returnShippingMethod, returnId }) => {
        return !!returnShippingMethod && !!returnId
      }
    ).then(() => {
      const returnShippingOption = useRemoteQueryStep({
        entry_point: "shipping_options",
        fields: [
          "id",
          "provider_id",
          "service_zone.fulfillment_set.location.id",
          "service_zone.fulfillment_set.location.address.*",
        ],
        variables: {
          id: returnShippingMethod.shipping_option_id,
        },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "exchange-return-shipping-option" })

      const fulfillmentData = transform(
        {
          order,
          items: order.items!,
          shippingOption: returnShippingOption,
        },
        prepareFulfillmentData
      )

      const returnFulfillment =
        createReturnFulfillmentWorkflow.runAsStep(fulfillmentData)

      const returnLink = transform(
        { returnId, fulfillment: returnFulfillment },
        (data) => {
          return [
            {
              [Modules.ORDER]: { return_id: data.returnId },
              [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
            },
          ]
        }
      )

      createRemoteLinkStep(returnLink).config({
        name: "exchange-return-shipping-fulfillment-link",
      })
    })

    createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    return new WorkflowResponse(orderPreview)
  }
)
