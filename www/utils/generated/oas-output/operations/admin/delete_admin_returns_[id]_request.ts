/**
 * @oas [delete] /admin/returns/{id}/request
 * operationId: DeleteReturnsIdRequest
 * summary: Cancel Return Request
 * description: Cancel a requested return.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The return's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/returns/{id}/request' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Returns
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The return's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the deleted object.
 *               default: return
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the return was deleted.
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
 * x-workflow: cancelReturnRequestWorkflow
 * 
*/

