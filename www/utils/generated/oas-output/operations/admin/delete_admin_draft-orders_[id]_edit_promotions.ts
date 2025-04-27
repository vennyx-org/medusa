/**
 * @oas [delete] /admin/draft-orders/{id}/edit/promotions
 * operationId: DeleteDraftOrdersIdEditPromotions
 * summary: Remove Promotions from Draft Order Edit
 * x-sidebar-summary: Remove Promotions
 * description: Remove specified promotions from a draft order edit.
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
 *       sdk.admin.draftOrder.removePromotions("order_123", {
 *         promo_codes: ["PROMO_CODE_1", "PROMO_CODE_2"],
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/draft-orders/{id}/edit/promotions' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Draft Orders
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDraftOrderPreviewResponse"
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
 * x-workflow: removeDraftOrderPromotionsWorkflow
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminRemoveDraftOrderPromotions"
 * 
*/

