/**
 * @schema AdminServiceZone
 * type: object
 * description: The shipping option's service zone.
 * x-schemaName: AdminServiceZone
 * required:
 *   - id
 *   - name
 *   - fulfillment_set_id
 *   - fulfillment_set
 *   - geo_zones
 *   - shipping_options
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The service zone's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The service zone's name.
 *   fulfillment_set_id:
 *     type: string
 *     title: fulfillment_set_id
 *     description: The service zone's fulfillment set id.
 *   fulfillment_set:
 *     $ref: "#/components/schemas/AdminFulfillmentSet"
 *   geo_zones:
 *     type: array
 *     description: The service zone's geo zones.
 *     items:
 *       $ref: "#/components/schemas/AdminGeoZone"
 *   shipping_options:
 *     type: array
 *     description: The service zone's shipping options.
 *     items:
 *       $ref: "#/components/schemas/AdminShippingOption"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The service zone's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The service zone's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The service zone's deleted at.
 * 
*/

