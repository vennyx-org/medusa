/**
 * @schema AdminProductVariant
 * type: object
 * description: The product variant's details.
 * x-schemaName: AdminProductVariant
 * required:
 *   - prices
 *   - id
 *   - title
 *   - sku
 *   - barcode
 *   - ean
 *   - upc
 *   - allow_backorder
 *   - manage_inventory
 *   - hs_code
 *   - origin_country
 *   - mid_code
 *   - material
 *   - weight
 *   - length
 *   - height
 *   - width
 *   - options
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   prices:
 *     type: array
 *     description: The variant's prices.
 *     items:
 *       $ref: "#/components/schemas/AdminPrice"
 *   id:
 *     type: string
 *     title: id
 *     description: The variant's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The variant's title.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The variant's SKU.
 *   barcode:
 *     type: string
 *     title: barcode
 *     description: The variant's barcode.
 *   ean:
 *     type: string
 *     title: ean
 *     description: The variant's EAN code.
 *   upc:
 *     type: string
 *     title: upc
 *     description: The variant's UPC.
 *   allow_backorder:
 *     type: boolean
 *     title: allow_backorder
 *     description: Whether the variant can be ordered even if it's out of stock.
 *   manage_inventory:
 *     type: boolean
 *     title: manage_inventory
 *     description: Whether the Medusa application manages the variant's inventory quantity and availablility. If disabled, the variant is always considered in stock.
 *   inventory_quantity:
 *     type: number
 *     title: inventory_quantity
 *     description: The variant's inventory quantity. This is only included if you pass in the `fields` query parameter a `+variants.inventory_quantity` parameter.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The variant's HS code.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The variant's origin country.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The variant's MID code.
 *   material:
 *     type: string
 *     title: material
 *     description: The variant's material.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The variant's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The variant's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The variant's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The variant's width.
 *   variant_rank:
 *     type: number
 *     title: variant_rank
 *     description: The variant's rank among its sibling variants.
 *   options:
 *     type: array
 *     description: The variant's option values.
 *     items:
 *       $ref: "#/components/schemas/BaseProductOptionValue"
 *   product:
 *     $ref: "#/components/schemas/BaseProduct"
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The ID of the product that the variant belongs to.
 *   calculated_price:
 *     $ref: "#/components/schemas/BaseCalculatedPriceSet"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the variant was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the variant was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the variant was deleted.
 *   metadata:
 *     type: object
 *     description: The variant's metadata, can hold custom key-value pairs.
 * 
*/

