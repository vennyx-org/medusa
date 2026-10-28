/**
 * @oas [get] /admin/translations/settings
 * operationId: GetTranslationsSettings
 * summary: List Translation Settings
 * x-sidebar-summary: List Settings
 * description: Retrieve the list of translatable fields for all entities, such as products and collections.
 * x-authenticated: true
 * parameters:
 *   - name: entity_type
 *     in: query
 *     description: The entity to retrieve translation settings for.
 *     required: false
 *     schema:
 *       type: string
 *       title: entity_type
 *       description: The entity to retrieve translation settings for.
 *       example: product
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
 *       sdk.admin.translation.settings({
 *         entity_type: "product"
 *       })
 *       .then(({ translatable_fields }) => {
 *         console.log(translatable_fields)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/translations/settings' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Translations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminTranslationSettingsResponse"
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
 * x-since: 2.12.3
 * x-featureFlag: translation
 * 
*/

