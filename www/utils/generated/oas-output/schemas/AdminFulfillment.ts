/**
 * @schema AdminFulfillment
 * type: object
 * description: The fulfillment's details.
 * x-schemaName: AdminFulfillment
 * required:
 *   - id
 *   - location_id
 *   - provider_id
 *   - shipping_option_id
 *   - provider
 *   - delivery_address
 *   - items
 *   - labels
 *   - packed_at
 *   - shipped_at
 *   - delivered_at
 *   - canceled_at
 *   - data
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The fulfillment's ID.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the fulfillment's items are shipped from.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the fulfillment provider handling this fulfillment.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the shipping option this fulfillment is created for.
 *   provider:
 *     description: The details of the fulfillment provider using to handle this fulfillment.
 *     $ref: "#/components/schemas/AdminFulfillmentProvider"
 *   delivery_address:
 *     description: The address to deliver the item to.
 *     $ref: "#/components/schemas/AdminFulfillmentAddress"
 *   items:
 *     type: array
 *     description: The fulfillment's items.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentItem"
 *   labels:
 *     type: array
 *     description: The fulfillment's shipment labels.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentLabel"
 *   packed_at:
 *     type: string
 *     title: packed_at
 *     description: The date the fulfillment was packed at.
 *   shipped_at:
 *     type: string
 *     title: shipped_at
 *     description: The date the fulfillment was shipped at.
 *   delivered_at:
 *     type: string
 *     title: delivered_at
 *     description: The date the fulfillment was delivered at.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the fulfillment was canceled at.
 *   data:
 *     type: object
 *     description: The fulfillment's data, useful for the third-party provider handling the fulfillment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property
 *   metadata:
 *     type: object
 *     description: The fulfillment's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the fulfillment was created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the fulfillment was updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the fulfillment was deleted at.
 * 
*/

