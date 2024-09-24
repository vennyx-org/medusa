/**
 * @schema AdminShippingOption
 * type: object
 * description: The shipping option's details.
 * x-schemaName: AdminShippingOption
 * required:
 *   - id
 *   - name
 *   - price_type
 *   - service_zone_id
 *   - service_zone
 *   - provider_id
 *   - provider
 *   - shipping_option_type_id
 *   - type
 *   - shipping_profile_id
 *   - shipping_profile
 *   - rules
 *   - prices
 *   - data
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The shipping option's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping option's name.
 *   price_type:
 *     type: string
 *     description: The shipping option's price type. If it's `flat`, the price is fixed and is set in the `prices` property. If it's `calculated`, the price is calculated on checkout by the associated fulfillment provider.
 *     enum:
 *       - calculated
 *       - flat
 *   service_zone_id:
 *     type: string
 *     title: service_zone_id
 *     description: The ID of the service zone this option belongs to.
 *   service_zone:
 *     $ref: "#/components/schemas/AdminServiceZone"
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the provider handling fulfillments created from this shipping option.
 *   provider:
 *     $ref: "#/components/schemas/AdminFulfillmentProvider"
 *   shipping_option_type_id:
 *     type: string
 *     title: shipping_option_type_id
 *     description: The ID of the associated shipping option type.
 *   type:
 *     $ref: "#/components/schemas/AdminShippingOption"
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The ID of the associated shipping profile.
 *   shipping_profile:
 *     $ref: "#/components/schemas/AdminShippingProfile"
 *   rules:
 *     type: array
 *     description: The shipping option's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminShippingOptionRule"
 *   prices:
 *     type: array
 *     description: The shipping option's prices. If the `price_type` is `calculated`, this array will be empty since the price is calculated by the fulfillment provider during checkout.
 *     items:
 *       $ref: "#/components/schemas/AdminShippingOptionPrice"
 *   data:
 *     type: object
 *     description: The shipping option's data, useful for the fulfillment provider handling fulfillments created from this option.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the shipping option was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the shipping option was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the shipping option was deleted.
 * 
*/

