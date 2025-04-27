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
import { OrderChangeDTO, OrderDTO, OrderWorkflow } from "@medusajs/types"
import { useRemoteQueryStep } from "../../common"
import {
  addOrderLineItemsWorkflow,
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
  updateOrderTaxLinesWorkflow,
} from "../../order"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { refreshDraftOrderAdjustmentsWorkflow } from "./refresh-draft-order-adjustments"

export const addDraftOrderItemsWorkflowId = "add-draft-order-items"

/**
 * This workflow adds items to a draft order. It's used by the
 * [Add Item to Draft Order Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititems).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around adding items to
 * a draft order.
 * 
 * @example
 * const { result } = await addDraftOrderItemsWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     items: [{ 
 *       variant_id: "variant_123", 
 *       quantity: 1 
 *     }]
 *   }
 * })
 * 
 * @summary
 * 
 * Add items to a draft order.
 */
export const addDraftOrderItemsWorkflow = createWorkflow(
  addDraftOrderItemsWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderEditAddNewItemWorkflowInput>
  ) {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const lineItems = addOrderLineItemsWorkflow.runAsStep({
      input: {
        order_id: order.id,
        items: input.items,
      },
    })

    const lineItemIds = transform(lineItems, (lineItems) => {
      return lineItems.map((item) => item.id)
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        item_ids: lineItemIds,
      },
    })

    const appliedPromoCodes: string[] = transform(order, (order) => {
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
      refreshDraftOrderAdjustmentsWorkflow.runAsStep({
        input: {
          order,
          promo_codes: appliedPromoCodes,
          action: PromotionActions.REPLACE,
        },
      })
    })

    const orderChangeActionInput = transform(
      { order, orderChange, items: input.items, lineItems },
      ({ order, orderChange, items, lineItems }) => {
        return items.map((item, index) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          version: orderChange.version,
          action: ChangeActionType.ITEM_ADD,
          internal_note: item.internal_note,
          details: {
            reference_id: lineItems[index].id,
            quantity: item.quantity,
            unit_price: item.unit_price ?? lineItems[index].unit_price,
            compare_at_unit_price:
              item.compare_at_unit_price ??
              lineItems[index].compare_at_unit_price,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
