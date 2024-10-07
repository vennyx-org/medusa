/**
 * @schema BaseCustomerAddress
 * type: object
 * description: The customer's address.
 * x-schemaName: BaseCustomerAddress
 * required:
 *   - id
 *   - address_name
 *   - is_default_shipping
 *   - is_default_billing
 *   - customer_id
 *   - company
 *   - first_name
 *   - last_name
 *   - address_1
 *   - address_2
 *   - city
 *   - country_code
 *   - province
 *   - postal_code
 *   - phone
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The address's ID.
 *   address_name:
 *     type: string
 *     title: address_name
 *     description: The address's name.
 *   is_default_shipping:
 *     type: boolean
 *     title: is_default_shipping
 *     description: Whether the address is the default shipping address.
 *   is_default_billing:
 *     type: boolean
 *     title: is_default_billing
 *     description: Whether the address is the default billing address.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that this address belongs to.
 *   company:
 *     type: string
 *     title: company
 *     description: The customer's company.
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The customer's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The customer's last name.
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
 *   phone:
 *     type: string
 *     title: phone
 *     description: The address's phone.
 *   metadata:
 *     type: object
 *     description: The address's metadata, used to store custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The address's creation date.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The address's update date.
 * 
*/

