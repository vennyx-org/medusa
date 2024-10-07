/**
 * @schema AdminProduct
 * type: object
 * description: The product's details.
 * x-schemaName: AdminProduct
 * required:
 *   - variants
 *   - type
 *   - options
 *   - images
 *   - length
 *   - title
 *   - status
 *   - description
 *   - id
 *   - handle
 *   - subtitle
 *   - is_giftcard
 *   - thumbnail
 *   - width
 *   - weight
 *   - height
 *   - origin_country
 *   - hs_code
 *   - mid_code
 *   - material
 *   - collection_id
 *   - type_id
 *   - discountable
 *   - external_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   collection:
 *     $ref: "#/components/schemas/AdminCollection"
 *   categories:
 *     type: array
 *     description: The product's categories.
 *     items:
 *       $ref: "#/components/schemas/AdminProductCategory"
 *   sales_channels:
 *     type: array
 *     description: The sales channels that the product is available in.
 *     items:
 *       $ref: "#/components/schemas/AdminSalesChannel"
 *   variants:
 *     type: array
 *     description: The product's variants.
 *     items:
 *       $ref: "#/components/schemas/AdminProductVariant"
 *   type:
 *     $ref: "#/components/schemas/AdminProductType"
 *   tags:
 *     type: array
 *     description: The product's tags.
 *     items:
 *       $ref: "#/components/schemas/AdminProductTag"
 *   length:
 *     type: number
 *     title: length
 *     description: The product's length.
 *   title:
 *     type: string
 *     title: title
 *     description: The product's title.
 *   status:
 *     type: string
 *     description: The product's status.
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *   options:
 *     type: array
 *     description: The product's options.
 *     items:
 *       $ref: "#/components/schemas/AdminProductOption"
 *   description:
 *     type: string
 *     title: description
 *     description: The product's description.
 *   id:
 *     type: string
 *     title: id
 *     description: The product's ID.
 *   metadata:
 *     type: object
 *     description: The product's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the product was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the product was updated.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The product's unique handle.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The product's subtitle.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: Whether the product is a gift card.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The product's thumbnail.
 *   width:
 *     type: number
 *     title: width
 *     description: The product's width.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The product's weight.
 *   height:
 *     type: number
 *     title: height
 *     description: The product's height.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The product's origin country.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The product's HS code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The product's MID code.
 *   material:
 *     type: string
 *     title: material
 *     description: The product's material.
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The ID of the collection that the product belongs to.
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The ID of the product's type.
 *   images:
 *     type: array
 *     description: The product's images.
 *     items:
 *       $ref: "#/components/schemas/AdminProductImage"
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: Whether discounts can be applied on the product.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The ID of a product in an external system, such as an ERP or CMS.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the product was deleted.
 * 
*/

