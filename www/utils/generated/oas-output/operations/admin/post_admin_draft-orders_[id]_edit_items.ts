/**
 * @oas [post] /admin/draft-orders/{id}/edit/items
 * operationId: PostDraftOrdersIdEditItems
 * summary: Add Item to Draft Order Edit
 * x-sidebar-summary: Add Item
 * description: Add an item to a draft order edit.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The draft order's ID.
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
 *         $ref: "#/components/schemas/AdminAddDraftOrderItems"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.draftOrder.addItems("order_123", {
 *         items: [
 *           {
 *             variant_id: "variant_123",
 *             quantity: 1,
 *           },
 *         ],
 *       })
 *       .then(({ draft_order_preview }) => {
 *         console.log(draft_order_preview)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/draft-orders/{id}/edit/items' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Draft Orders
 * responses:
 *   "200":
 *     description: OK
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
 * x-workflow: addDraftOrderItemsWorkflow
 * 
*/

