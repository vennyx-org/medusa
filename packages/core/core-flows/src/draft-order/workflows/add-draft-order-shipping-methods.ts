import {
  ChangeActionType,
  OrderChangeStatus,
  PromotionActions,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BigNumberInput, OrderChangeDTO, OrderDTO } from "@medusajs/types"
import { useRemoteQueryStep } from "../../common"
import {
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
  updateOrderTaxLinesWorkflow,
} from "../../order"
import { createOrderShippingMethods } from "../../order/steps/create-order-shipping-methods"
import { prepareShippingMethod } from "../../order/utils/prepare-shipping-method"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { refreshDraftOrderAdjustmentsWorkflow } from "./refresh-draft-order-adjustments"

export const addDraftOrderShippingMethodsWorkflowId =
  "add-draft-order-shipping-methods"

/**
 * The details of the shipping methods to add to a draft order.
 */
export interface AddDraftOrderShippingMethodsWorkflowInput {
  /**
   * The ID of the draft order to add the shipping methods to.
   */
  order_id: string
  /**
   * The ID of the shipping option to add as a shipping method.
   */
  shipping_option_id: string
  /**
   * The custom amount to add the shipping method with.
   * If not specified, the shipping option's fixed or calculated price will be used.
   */
  custom_amount?: BigNumberInput | null
}

/**
 * This workflow adds shipping methods to a draft order. It's used by the
 * [Add Shipping Method to Draft Order Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethods).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around adding shipping methods to
 * a draft order.
 * 
 * @example
 * const { result } = await addDraftOrderShippingMethodsWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     shipping_option_id: "so_123",
 *     custom_amount: 10
 *   }
 * })
 * 
 * @summary
 * 
 * Add shipping methods to a draft order.
 */
export const addDraftOrderShippingMethodsWorkflow = createWorkflow(
  addDraftOrderShippingMethodsWorkflowId,
  function (input: WorkflowData<AddDraftOrderShippingMethodsWorkflowInput>) {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: [
        "id",
        "name",
        "calculated_price.calculated_amount",
        "calculated_price.is_calculated_price_tax_inclusive",
      ],
      variables: {
        id: input.shipping_option_id,
        calculated_price: {
          context: { currency_code: order.currency_code },
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const shippingMethodInput = transform(
      {
        relatedEntity: { order_id: order.id },
        shippingOptions,
        customPrice: input.custom_amount as any, // Need to cast this to any otherwise the type becomes to complex.
        orderChange,
        input,
      },
      prepareShippingMethod()
    )

    const createdMethods = createOrderShippingMethods({
      shipping_methods: [shippingMethodInput],
    })

    const shippingMethodIds = transform(createdMethods, (createdMethods) => {
      return createdMethods.map((item) => item.id)
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        shipping_method_ids: shippingMethodIds,
      },
    })

    const appliedPromoCodes = transform(order, (order) => {
      const promotionLink = (order as any).promotion_link

      if (!promotionLink) {
        return []
      }

      if (Array.isArray(promotionLink)) {
        return promotionLink.map((promo) => promo.promotion.code)
      }

      return [promotionLink.promotion.code]
    })

    // If any the order has any promo codes, then we need to refresh the adjustments.
    when(
      appliedPromoCodes,
      (appliedPromoCodes) => appliedPromoCodes.length > 0
    ).then(() => {
      const refetchedOrder = useRemoteQueryStep({
        entry_point: "orders",
        fields: draftOrderFieldsForRefreshSteps,
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "refetched-order-query" })

      refreshDraftOrderAdjustmentsWorkflow.runAsStep({
        input: {
          order: refetchedOrder,
          promo_codes: appliedPromoCodes,
          action: PromotionActions.REPLACE,
        },
      })
    })

    const orderChangeActionInput = transform(
      {
        order,
        shippingOptions,
        createdMethods,
        customPrice: input.custom_amount as any, // Need to cast this to any otherwise the type becomes too complex.
        orderChange,
      },
      ({
        shippingOptions,
        order,
        createdMethods,
        customPrice,
        orderChange,
      }) => {
        const shippingOption = shippingOptions[0]
        const createdMethod = createdMethods[0]
        const methodPrice =
          customPrice ?? shippingOption.calculated_price.calculated_amount

        return {
          action: ChangeActionType.SHIPPING_ADD,
          reference: "order_shipping_method",
          order_change_id: orderChange.id,
          reference_id: createdMethod.id,
          amount: methodPrice,
          order_id: order.id,
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
