/**
 * @oas [post] /admin/inventory-items/{id}/location-levels/batch
 * operationId: PostInventoryItemsIdLocationLevelsBatch
 * summary: Manage Inventory Levels of Inventory Item
 * x-sidebar-summary: Manage Inventory Levels
 * description: Manage the inventory levels of an inventory item to create or delete them.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The inventory levels to create or delete.
 *         properties:
 *           create:
 *             type: array
 *             description: The inventory levels to create.
 *             items:
 *               type: object
 *               description: The inventory level's details.
 *               required:
 *                 - location_id
 *               properties:
 *                 location_id:
 *                   type: string
 *                   title: location_id
 *                   description: The ID of the associated location.
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The inventory level's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The inventory level's incoming quantity.
 *           update:
 *             type: array
 *             description: The inventory levels to update.
 *             items:
 *               type: object
 *               description: The inventory level's details.
 *               properties:
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The inventory level's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The inventory level's incoming quantity.
 *           delete:
 *             type: array
 *             description: The inventory levels to delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The ID of the inventory level to delete.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels/batch' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The inventory item's details.
 *           required:
 *             - inventory_item
 *           properties:
 *             inventory_item:
 *               type: object
 *               description: The inventory item's details.
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: bulkCreateDeleteLevelsWorkflow
 * 
*/

