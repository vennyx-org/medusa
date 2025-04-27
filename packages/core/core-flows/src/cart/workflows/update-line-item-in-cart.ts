import {
  AdditionalData,
  UpdateLineItemInCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import { CartWorkflowEvents, isDefined, MedusaError } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { emitEventStep } from "../../common/steps/emit-event"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { updateLineItemsStepWithSelector } from "../../line-item/steps"
import { validateCartStep } from "../steps/validate-cart"
import { validateVariantPricesStep } from "../steps/validate-variant-prices"
import {
  cartFieldsForPricingContext,
  productVariantsFields,
} from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { refreshCartItemsWorkflow } from "./refresh-cart-items"
import { pricingContextResult } from "../utils/schemas"

const cartFields = cartFieldsForPricingContext.concat(["items.*"])

export const updateLineItemInCartWorkflowId = "update-line-item-in-cart"
/**
 * This workflow updates a line item's details in a cart. You can update the line item's quantity, unit price, and more. This workflow is executed
 * by the [Update Line Item Store API Route](https://docs.medusajs.com/api/store#carts_postcartsidlineitemsline_id).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to update a line item's details in your custom flows.
 *
 * @example
 * const { result } = await updateLineItemInCartWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     item_id: "item_123",
 *     update: {
 *       quantity: 2
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update a cart's line item.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 * @property hooks.setPricingContext - This hook is executed before the cart is updated. You can consume this hook to return any custom context useful for the prices retrieval of the line item's variant.
 * 
 * For example, assuming you have the following custom pricing rule:
 * 
 * ```json
 * {
 *   "attribute": "location_id",
 *   "operator": "eq",
 *   "value": "sloc_123",
 * }
 * ```
 * 
 * You can consume the `setPricingContext` hook to add the `location_id` context to the prices calculation:
 * 
 * ```ts
 * import { addToCartWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 * 
 * addToCartWorkflow.hooks.setPricingContext((
 *   { cart, variantIds, items, additional_data }, { container }
 * ) => {
 *   return new StepResponse({
 *     location_id: "sloc_123", // Special price for in-store purchases
 *   });
 * });
 * ```
 * 
 * The variant's prices will now be retrieved using the context you return.
 * 
 * :::note
 * 
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 * 
 * :::
 */
export const updateLineItemInCartWorkflow = createWorkflow(
  updateLineItemInCartWorkflowId,
  (
    input: WorkflowData<UpdateLineItemInCartWorkflowInputDTO & AdditionalData>
  ) => {
    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: cartFields,
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-cart" })

    const cart = transform({ cartQuery }, ({ cartQuery }) => cartQuery.data[0])
    const item = transform({ cart, input }, ({ cart, input }) => {
      return cart.items.find((i) => i.id === input.item_id)
    })

    validateCartStep({ cart })

    const validate = createHook("validate", {
      input,
      cart,
    })

    const variantIds = transform({ item }, ({ item }) => {
      return [item.variant_id].filter(Boolean)
    })

    const setPricingContext = createHook(
      "setPricingContext",
      {
        cart,
        item,
        variantIds,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )

    const setPricingContextResult = setPricingContext.getResult()
    const pricingContext = transform(
      { cart, setPricingContextResult },
      (data) => {
        return {
          ...data.cart,
          ...(data.setPricingContextResult ? data.setPricingContextResult : {}),
          currency_code: data.cart.currency_code,
          region_id: data.cart.region_id,
          region: data.cart.region,
          customer_id: data.cart.customer_id,
          customer: data.cart.customer,
        }
      }
    )

    const variants = when({ variantIds }, ({ variantIds }) => {
      return !!variantIds.length
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "variants",
        fields: productVariantsFields,
        variables: {
          id: variantIds,
          calculated_price: {
            context: pricingContext,
          },
        },
      }).config({ name: "fetch-variants" })
    })

    validateVariantPricesStep({ variants })

    const items = transform({ input, item }, (data) => {
      return [
        Object.assign(data.item, { quantity: data.input.update.quantity }),
      ]
    })

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: pricingContext.sales_channel_id,
        variants,
        items,
      },
    })

    const lineItemUpdate = transform({ input, variants, item }, (data) => {
      const variant = data.variants?.[0] ?? undefined
      const item = data.item

      const updateData = {
        ...data.input.update,
        unit_price: isDefined(data.input.update.unit_price)
          ? data.input.update.unit_price
          : item.unit_price,
        is_custom_price: isDefined(data.input.update.unit_price)
          ? true
          : item.is_custom_price,
        is_tax_inclusive:
          item.is_tax_inclusive ||
          variant?.calculated_price?.is_calculated_price_tax_inclusive,
      }

      if (variant && !updateData.is_custom_price) {
        updateData.unit_price = variant.calculated_price.calculated_amount
      }

      if (!isDefined(updateData.unit_price)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Line item ${item.title} has no unit price`
        )
      }

      return {
        data: updateData,
        selector: {
          id: data.input.item_id,
        },
      }
    })

    updateLineItemsStepWithSelector(lineItemUpdate)

    refreshCartItemsWorkflow.runAsStep({
      input: { cart_id: input.cart_id },
    })

    emitEventStep({
      eventName: CartWorkflowEvents.UPDATED,
      data: { id: input.cart_id },
    })

    return new WorkflowResponse(void 0, {
      hooks: [validate, setPricingContext] as const,
    })
  }
)
