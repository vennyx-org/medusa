/**
 * @schema AdminUpdateOrder
 * type: object
 * description: The details to update in the order.
 * x-schemaName: AdminUpdateOrder
 * properties:
 *   email:
 *     type: string
 *     title: email
 *     description: The order's email.
 *     format: email
 *   shipping_address:
 *     type: object
 *     description: The order's shipping address.
 *     properties:
 *       first_name:
 *         type: string
 *         title: first_name
 *         description: The address's first name.
 *       last_name:
 *         type: string
 *         title: last_name
 *         description: The address's last name.
 *       phone:
 *         type: string
 *         title: phone
 *         description: The address's phone.
 *       company:
 *         type: string
 *         title: company
 *         description: The address's company.
 *       address_1:
 *         type: string
 *         title: address_1
 *         description: The address's first line.
 *       address_2:
 *         type: string
 *         title: address_2
 *         description: The address's second line.
 *       city:
 *         type: string
 *         title: city
 *         description: The address's city.
 *       country_code:
 *         type: string
 *         title: country_code
 *         description: The address's country code.
 *         example: us
 *       province:
 *         type: string
 *         title: province
 *         description: The address's ISO 3166-2 province code. Must be lower-case.
 *         example: "us-ca"
 *         externalDocs:
 *           url: https://en.wikipedia.org/wiki/ISO_3166-2
 *           description: Learn more about ISO 3166-2
 *       postal_code:
 *         type: string
 *         title: postal_code
 *         description: The address's postal code.
 *       metadata:
 *         type: object
 *         description: The address's metadata, can hold custom key-value pairs.
 *   billing_address:
 *     type: object
 *     description: The order's billing address.
 *     properties:
 *       first_name:
 *         type: string
 *         title: first_name
 *         description: The address's first name.
 *       last_name:
 *         type: string
 *         title: last_name
 *         description: The address's last name.
 *       phone:
 *         type: string
 *         title: phone
 *         description: The address's phone.
 *       company:
 *         type: string
 *         title: company
 *         description: The address's company.
 *       address_1:
 *         type: string
 *         title: address_1
 *         description: The address's first line.
 *       address_2:
 *         type: string
 *         title: address_2
 *         description: The address's second line.
 *       city:
 *         type: string
 *         title: city
 *         description: The address's city.
 *       country_code:
 *         type: string
 *         title: country_code
 *         description: The address's country code.
 *         example: us
 *       province:
 *         type: string
 *         title: province
 *         description: The address's ISO 3166-2 province code. Must be lower-case.
 *         example: "us-ca"
 *         externalDocs:
 *           url: https://en.wikipedia.org/wiki/ISO_3166-2
 *           description: Learn more about ISO 3166-2
 *       postal_code:
 *         type: string
 *         title: postal_code
 *         description: The address's postal code.
 *       metadata:
 *         type: object
 *         description: The address's metadata, can hold custom key-value pairs.
 *   metadata:
 *     type: object
 *     description: The order's metadata, can hold custom key-value pairs.
 * 
*/

