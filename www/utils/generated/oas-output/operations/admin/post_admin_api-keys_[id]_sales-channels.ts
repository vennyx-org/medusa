/**
 * @oas [post] /admin/api-keys/{id}/sales-channels
 * operationId: PostApiKeysIdSalesChannels
 * summary: Manage Sales Channels of a Publishable API Key
 * x-sidebar-summary: Manage Sales Channels
 * description: Manage the sales channels of a publishable API key, either to associate them or remove them from the API key.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The API key's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The sales channels to add or remove from the publishable API key.
 *         properties:
 *           add:
 *             type: array
 *             description: The sales channels to add to the publishable API key.
 *             items:
 *               type: string
 *               title: add
 *               description: A sales channel's ID.
 *           remove:
 *             type: array
 *             description: The sales channels to remove from the publishable API key.
 *             items:
 *               type: string
 *               title: remove
 *               description: A sales channel's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/api-keys/{id}/sales-channels' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Api Keys
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminApiKeyResponse"
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
 * x-workflow: linkSalesChannelsToApiKeyWorkflow
 * 
*/

