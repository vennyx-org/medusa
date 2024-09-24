/**
 * @schema AdminProductType
 * type: object
 * description: The product type's details.
 * x-schemaName: AdminProductType
 * required:
 *   - id
 *   - value
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The type's ID.
 *   value:
 *     type: string
 *     title: value
 *     description: The type's value.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the type was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the type was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the type was deleted.
 *   metadata:
 *     type: object
 *     description: The type's metadata, can hold custom key-value pairs.
 * 
*/

