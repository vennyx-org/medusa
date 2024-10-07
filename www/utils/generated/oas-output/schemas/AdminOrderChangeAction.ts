/**
 * @schema AdminOrderChangeAction
 * type: object
 * description: The order change action's details.
 * x-schemaName: AdminOrderChangeAction
 * required:
 *   - order_change
 *   - order
 *   - order_id
 *   - internal_note
 *   - id
 *   - created_at
 *   - updated_at
 *   - return_id
 *   - exchange_id
 *   - claim_id
 *   - order_change_id
 *   - reference
 *   - reference_id
 *   - action
 *   - details
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The action's ID.
 *   order_change_id:
 *     type: string
 *     title: order_change_id
 *     description: The ID of the order change that the action belongs to.
 *   order_change:
 *     $ref: "#/components/schemas/AdminOrderChange"
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order the associated change is for.
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the associated return.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The ID of the associated claim.
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The ID of the associated exchange.
 *   order:
 *     type: string
 *     title: order
 *     description: The order change's order.
 *     externalDocs:
 *       url: "#pagination"
 *   reference:
 *     type: string
 *     title: reference
 *     description: The name of the table this action applies on.
 *     enum:
 *       - claim
 *       - exchange
 *       - return
 *       - order_shipping_method
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of the record in the referenced table.
 *   action:
 *     type: string
 *     description: The applied action.
 *     enum:
 *       - CANCEL_RETURN_ITEM
 *       - FULFILL_ITEM
 *       - DELIVER_ITEM
 *       - CANCEL_ITEM_FULFILLMENT
 *       - ITEM_ADD
 *       - ITEM_REMOVE
 *       - ITEM_UPDATE
 *       - RECEIVE_DAMAGED_RETURN_ITEM
 *       - RECEIVE_RETURN_ITEM
 *       - RETURN_ITEM
 *       - SHIPPING_ADD
 *       - SHIPPING_REMOVE
 *       - SHIP_ITEM
 *       - WRITE_OFF_ITEM
 *       - REINSTATE_ITEM
 *   details:
 *     type: object
 *     description: The action's details.
 *     example:
 *       reference_id: 123
 *       quantity: 1
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note that's viewed only by admin users.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the action was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the action was updated.
 * 
*/

