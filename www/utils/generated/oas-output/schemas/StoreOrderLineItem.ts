/**
 * @schema StoreOrderLineItem
 * type: object
 * description: The item's details.
 * x-schemaName: StoreOrderLineItem
 * required:
 *   - title
 *   - id
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - item_total
 *   - item_subtotal
 *   - item_tax_total
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_tax_total
 *   - subtitle
 *   - thumbnail
 *   - variant_id
 *   - product_id
 *   - product_title
 *   - product_description
 *   - product_subtitle
 *   - product_type
 *   - product_collection
 *   - product_handle
 *   - variant_sku
 *   - variant_barcode
 *   - variant_title
 *   - variant_option_values
 *   - requires_shipping
 *   - is_discountable
 *   - is_tax_inclusive
 *   - unit_price
 *   - quantity
 *   - detail
 *   - refundable_total
 *   - refundable_total_per_unit
 * properties:
 *   variant:
 *     $ref: "#/components/schemas/StoreProductVariant"
 *   product:
 *     $ref: "#/components/schemas/StoreProduct"
 *   title:
 *     type: string
 *     title: title
 *     description: The item's title.
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the item was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the item was updated.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The total of a single quantity including taxes and promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The total of a single quantity excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The total taxes of a single quantity, including promotions.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The item's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The item's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The total taxes of the item, excluding promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The item's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The item's total excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The total taxes of the item, including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The item's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total taxes applied on the discount amount.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The item's subtitle.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The item's thumbnail URL.
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The ID of the item's variant.
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The ID of the associated product.
 *   product_title:
 *     type: string
 *     title: product_title
 *     description: The item's product title.
 *   product_description:
 *     type: string
 *     title: product_description
 *     description: The item's product description.
 *   product_subtitle:
 *     type: string
 *     title: product_subtitle
 *     description: The item's product subtitle.
 *   product_type:
 *     type: string
 *     title: product_type
 *     description: The ID of the associated product's type.
 *   product_collection:
 *     type: string
 *     title: product_collection
 *     description: The ID of the associated product's collection.
 *   product_handle:
 *     type: string
 *     title: product_handle
 *     description: The item's product handle.
 *   variant_sku:
 *     type: string
 *     title: variant_sku
 *     description: The item's variant SKU.
 *   variant_barcode:
 *     type: string
 *     title: variant_barcode
 *     description: The item's variant barcode.
 *   variant_title:
 *     type: string
 *     title: variant_title
 *     description: The item's variant title.
 *   variant_option_values:
 *     type: object
 *     description: The associated variant's values of the associated product's options.
 *     example:
 *       Color: Red
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: Whether the item requires shipping.
 *   is_discountable:
 *     type: boolean
 *     title: is_discountable
 *     description: Whether the item is discountable.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the item includes taxes.
 *   compare_at_unit_price:
 *     type: number
 *     title: compare_at_unit_price
 *     description: The original price of the item before a promotion or sale.
 *   unit_price:
 *     type: number
 *     title: unit_price
 *     description: The item's unit price.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   tax_lines:
 *     type: array
 *     description: The item's tax lines.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderLineItemTaxLine"
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderLineItemAdjustment"
 *   detail:
 *     $ref: "#/components/schemas/BaseOrderItemDetail"
 *   refundable_total:
 *     type: number
 *     title: refundable_total
 *     description: The refundable amount of the item.
 *   refundable_total_per_unit:
 *     type: number
 *     title: refundable_total_per_unit
 *     description: The refundable amount for a single quantity of the item.
 * 
*/

