/**
 * @schema Order
 * type: object
 * description: The order change's order.
 * x-schemaName: Order
 * required:
 *   - id
 *   - version
 *   - status
 *   - currency_code
 *   - created_at
 *   - updated_at
 *   - original_item_total
 *   - original_item_subtotal
 *   - original_item_tax_total
 *   - item_total
 *   - item_subtotal
 *   - item_tax_total
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_subtotal
 *   - discount_total
 *   - discount_tax_total
 *   - gift_card_total
 *   - gift_card_tax_total
 *   - shipping_total
 *   - shipping_subtotal
 *   - shipping_tax_total
 *   - original_shipping_total
 *   - original_shipping_subtotal
 *   - original_shipping_tax_total
 *   - raw_original_item_total
 *   - raw_original_item_subtotal
 *   - raw_original_item_tax_total
 *   - raw_item_total
 *   - raw_item_subtotal
 *   - raw_item_tax_total
 *   - raw_original_total
 *   - raw_original_subtotal
 *   - raw_original_tax_total
 *   - raw_total
 *   - raw_subtotal
 *   - raw_tax_total
 *   - raw_discount_total
 *   - raw_discount_tax_total
 *   - raw_gift_card_total
 *   - raw_gift_card_tax_total
 *   - raw_shipping_total
 *   - raw_shipping_subtotal
 *   - raw_shipping_tax_total
 *   - raw_original_shipping_total
 *   - raw_original_shipping_subtotal
 *   - raw_original_shipping_tax_total
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The order's ID.
 *   version:
 *     type: number
 *     title: version
 *     description: The order's version.
 *   order_change:
 *     $ref: "#/components/schemas/OrderChange"
 *   status:
 *     type: string
 *     description: The order's status.
 *     enum:
 *       - canceled
 *       - requires_action
 *       - pending
 *       - completed
 *       - draft
 *       - archived
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the region the order belongs to.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that placed the order.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel the order was placed in.
 *   email:
 *     type: string
 *     title: email
 *     description: The email of the customer that placed the order.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The order's currency code.
 *     example: usd
 *   shipping_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   items:
 *     type: array
 *     description: The order's items.
 *     items:
 *       $ref: "#/components/schemas/OrderLineItem"
 *   shipping_methods:
 *     type: array
 *     description: The order's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/OrderShippingMethod"
 *   transactions:
 *     type: array
 *     description: The order's transactions.
 *     items:
 *       $ref: "#/components/schemas/OrderTransaction"
 *   summary:
 *     type: object
 *     description: The order's summary.
 *   metadata:
 *     type: object
 *     description: The order's metadata, can hold custom key-value pairs.
 *   canceled_at:
 *     type: string
 *     format: date-time
 *     title: canceled_at
 *     description: The date the order was canceled.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the order was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the order was updated.
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The order items' total including taxes, excluding promotions.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The order items' total excluding taxes, including promotions.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The taxes total for order items, excluding promotions.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The order items' total including taxes and promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The order items' total excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The tax total of the order items including promotions.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The order's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The order's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The tax total of the order excluding promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The order's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The order's subtotal excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The tax total of the order including promotions.
 *   discount_subtotal:
 *     type: number
 *     title: discount_subtotal
 *     description: The total discount excluding taxes.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total discount including taxes.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The tax total applied on the discount.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The order's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The order's gift card tax total.
 *   shipping_total:
 *     type: number
 *     title: shipping_total
 *     description: The order's shipping total including taxes and promotions.
 *   shipping_subtotal:
 *     type: number
 *     title: shipping_subtotal
 *     description: The order's shipping total excluding taxes, including promotions.
 *   shipping_tax_total:
 *     type: number
 *     title: shipping_tax_total
 *     description: The total taxes of the order's shipping including taxes.
 *   original_shipping_total:
 *     type: number
 *     title: original_shipping_total
 *     description: The order's shipping total including taxes, excluding promotions.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The order's shipping total excluding taxes, including promotions.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The total taxes of the order's shipping excluding promotions.
 *   raw_original_item_total:
 *     type: object
 *     description: The order's raw original item total.
 *   raw_original_item_subtotal:
 *     type: object
 *     description: The order's raw original item subtotal.
 *   raw_original_item_tax_total:
 *     type: object
 *     description: The order's raw original item tax total.
 *   raw_item_total:
 *     type: object
 *     description: The order's raw item total.
 *   raw_item_subtotal:
 *     type: object
 *     description: The order's raw item subtotal.
 *   raw_item_tax_total:
 *     type: object
 *     description: The order's raw item tax total.
 *   raw_original_total:
 *     type: object
 *     description: The order's raw original total.
 *   raw_original_subtotal:
 *     type: object
 *     description: The order's raw original subtotal.
 *   raw_original_tax_total:
 *     type: object
 *     description: The order's raw original tax total.
 *   raw_total:
 *     type: object
 *     description: The order's raw total.
 *   raw_subtotal:
 *     type: object
 *     description: The order's raw subtotal.
 *   raw_tax_total:
 *     type: object
 *     description: The order's raw tax total.
 *   raw_discount_total:
 *     type: object
 *     description: The order's raw discount total.
 *   raw_discount_tax_total:
 *     type: object
 *     description: The order's raw discount tax total.
 *   raw_gift_card_total:
 *     type: object
 *     description: The order's raw gift card total.
 *   raw_gift_card_tax_total:
 *     type: object
 *     description: The order's raw gift card tax total.
 *   raw_shipping_total:
 *     type: object
 *     description: The order's raw shipping total.
 *   raw_shipping_subtotal:
 *     type: object
 *     description: The order's raw shipping subtotal.
 *   raw_shipping_tax_total:
 *     type: object
 *     description: The order's raw shipping tax total.
 *   raw_original_shipping_total:
 *     type: object
 *     description: The order's raw original shipping total.
 *   raw_original_shipping_subtotal:
 *     type: object
 *     description: The order's raw original shipping subtotal.
 *   raw_original_shipping_tax_total:
 *     type: object
 *     description: The order's raw original shipping tax total.
 * 
*/

