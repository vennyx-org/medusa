/**
 * @oas [delete] /admin/shipping-profiles/{id}
 * operationId: DeleteShippingProfilesId
 * summary: Delete a Shipping Profile
 * description: Delete a shipping profile.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping profile's ID.
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
 *       curl -X DELETE '{backend_url}/admin/shipping-profiles/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Shipping Profiles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingProfileDeleteResponse"
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
 * x-workflow: deleteShippingProfileWorkflow
 * 
*/

