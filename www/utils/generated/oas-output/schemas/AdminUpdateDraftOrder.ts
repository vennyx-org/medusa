/**
 * @schema AdminUpdateDraftOrder
 * type: object
 * description: The data to update in the draft order.
 * x-schemaName: AdminUpdateDraftOrder
 * properties:
 *   email:
 *     type: string
 *     title: email
 *     description: The customer email associated with the draft order.
 *     format: email
 *   shipping_address:
 *     type: object
 *     description: The draft order's shipping address.
 *     properties:
 *       first_name:
 *         type: string
 *         title: first_name
 *         description: The shipping address's first name.
 *       last_name:
 *         type: string
 *         title: last_name
 *         description: The shipping address's last name.
 *       phone:
 *         type: string
 *         title: phone
 *         description: The shipping address's phone.
 *       company:
 *         type: string
 *         title: company
 *         description: The shipping address's company.
 *       address_1:
 *         type: string
 *         title: address_1
 *         description: The first address line.
 *       address_2:
 *         type: string
 *         title: address_2
 *         description: The second address line.
 *       city:
 *         type: string
 *         title: city
 *         description: The shipping address's city.
 *       country_code:
 *         type: string
 *         title: country_code
 *         description: The shipping address's country code.
 *         example: us
 *       province:
 *         type: string
 *         title: province
 *         description: The shipping address's ISO 3166-2 province code. Must be lower-case.
 *         example: "us-ca"
 *         externalDocs:
 *           url: https://en.wikipedia.org/wiki/ISO_3166-2
 *           description: Learn more about ISO 3166-2
 *       postal_code:
 *         type: string
 *         title: postal_code
 *         description: The shipping address's postal code.
 *       metadata:
 *         type: object
 *         description: The shipping address's metadata, can hold custom key-value pairs.
 *   billing_address:
 *     type: object
 *     description: The draft order's billing address.
 *     properties:
 *       first_name:
 *         type: string
 *         title: first_name
 *         description: The billing address's first name.
 *       last_name:
 *         type: string
 *         title: last_name
 *         description: The billing address's last name.
 *       phone:
 *         type: string
 *         title: phone
 *         description: The billing address's phone.
 *       company:
 *         type: string
 *         title: company
 *         description: The billing address's company.
 *       address_1:
 *         type: string
 *         title: address_1
 *         description: The first address line.
 *       address_2:
 *         type: string
 *         title: address_2
 *         description: The second address line.
 *       city:
 *         type: string
 *         title: city
 *         description: The billing address's city.
 *       country_code:
 *         type: string
 *         title: country_code
 *         description: The billing address's country code.
 *         example: us
 *       province:
 *         type: string
 *         title: province
 *         description: The billing address's ISO 3166-2 province code. Must be lower-case.
 *         example: "us-ca"
 *         externalDocs:
 *           url: https://en.wikipedia.org/wiki/ISO_3166-2
 *           description: Learn more about ISO 3166-2
 *       postal_code:
 *         type: string
 *         title: postal_code
 *         description: The billing address's postal code.
 *       metadata:
 *         type: object
 *         description: The billing address's metadata, can hold custom key-value pairs.
 *   metadata:
 *     type: object
 *     description: The draft order's metadata, can hold custom key-value pairs.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer associated with the draft order.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel associated with the draft order.
 * 
*/

