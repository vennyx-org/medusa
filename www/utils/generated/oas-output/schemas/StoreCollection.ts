/**
 * @schema StoreCollection
 * type: object
 * description: The collection's details.
 * x-schemaName: StoreCollection
 * required:
 *   - title
 *   - metadata
 *   - id
 *   - handle
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The collection's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The collection's title.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The collection's handle.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the collection was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the collection was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the collection was deleted.
 *   products:
 *     type: array
 *     description: The collection's products.
 *     items:
 *       $ref: "#/components/schemas/StoreProduct"
 *   metadata:
 *     type: object
 *     description: The collection's metadata, can hold custom key-value pairs.
 * 
*/

