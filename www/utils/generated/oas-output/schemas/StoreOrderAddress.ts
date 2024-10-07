/**
 * @schema StoreOrderAddress
 * type: object
 * description: The address's details.
 * x-schemaName: StoreOrderAddress
 * required:
 *   - id
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   country:
 *     $ref: "#/components/schemas/StoreRegionCountry"
 *   id:
 *     type: string
 *     title: id
 *     description: The address's ID.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer this address belongs to.
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The address's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The address's last name.
 *   phone:
 *     type: string
 *     title: phone
 *     description: The address's phone.
 *   company:
 *     type: string
 *     title: company
 *     description: The address's company.
 *   address_1:
 *     type: string
 *     title: address_1
 *     description: The address's first line.
 *   address_2:
 *     type: string
 *     title: address_2
 *     description: The address's second line.
 *   city:
 *     type: string
 *     title: city
 *     description: The address's city.
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The address's country code.
 *     example: us
 *   province:
 *     type: string
 *     title: province
 *     description: The address's province.
 *   postal_code:
 *     type: string
 *     title: postal_code
 *     description: The address's postal code.
 *   metadata:
 *     type: object
 *     description: The address's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the address was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the address was updated.
 * 
*/

