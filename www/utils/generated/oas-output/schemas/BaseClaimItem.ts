/**
 * @schema BaseClaimItem
 * type: object
 * description: The claim item's details.
 * x-schemaName: BaseClaimItem
 * required:
 *   - id
 *   - claim_id
 *   - order_id
 *   - item_id
 *   - quantity
 *   - reason
 *   - raw_quantity
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The claim item's ID.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The ID of the claim this item belongs to.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this item belongs to.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The ID of the item in the order.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The quantity claimed.
 *   reason:
 *     type: string
 *     description: The claim's reason.
 *     enum:
 *       - missing_item
 *       - wrong_item
 *       - production_failure
 *       - other
 *   raw_quantity:
 *     type: object
 *     description: The quantity claimed.
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the claim was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the claim was updated.
 * 
*/

