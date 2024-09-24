/**
 * @oas [post] /admin/promotions/{id}/rules/batch
 * operationId: PostPromotionsIdRulesBatch
 * summary: Manage a Promotion's Rules
 * x-sidebar-summary: Manage Rules
 * description: Manage the rules of a promotion to create, update, or delete them.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
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
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The rules to create, update, or delete.
 *         properties:
 *           create:
 *             type: array
 *             description: The rules to create.
 *             items:
 *               type: object
 *               description: A rule's details.
 *               required:
 *                 - operator
 *                 - attribute
 *                 - values
 *               properties:
 *                 operator:
 *                   type: string
 *                   description: The operator used to check whether the rule applies on a cart. For example, `eq` means that the cart's value for the specified attribute must match the specified value.
 *                   enum:
 *                     - gte
 *                     - lte
 *                     - gt
 *                     - lt
 *                     - eq
 *                     - ne
 *                     - in
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The rule's description.
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The attribute to compare against when checking whether a promotion can be applied on a cart.
 *                   example: items.product.id
 *                 values:
 *                   oneOf:
 *                     - type: string
 *                       title: values
 *                       description: The attribute's value.
 *                       example: prod_123
 *                     - type: array
 *                       description: The allowed attribute values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: An attribute value.
 *                         example: prod_123
 *           update:
 *             type: array
 *             description: The rules to update.
 *             items:
 *               type: object
 *               description: The properties to update in a rule.
 *               required:
 *                 - id
 *                 - values
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The rule's ID.
 *                 operator:
 *                   type: string
 *                   description: The operator used to check whether the rule applies on a cart. For example, `eq` means that the cart's value for the specified attribute must match the specified value.
 *                   enum:
 *                     - gte
 *                     - lte
 *                     - gt
 *                     - lt
 *                     - eq
 *                     - ne
 *                     - in
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The rule's description.
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The attribute to compare against when checking whether a promotion can be applied on a cart.
 *                   example: items.product.id
 *                 values:
 *                   oneOf:
 *                     - type: string
 *                       title: values
 *                       description: The attribute's value.
 *                       example: prod_123
 *                     - type: array
 *                       description: The allowed attribute values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: An attribute value.
 *                         example: prod_123
 *           delete:
 *             type: array
 *             description: The rules to delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: A rule's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions/{id}/rules/batch' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Promotions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The result of the batch operations.
 *           required:
 *             - created
 *             - updated
 *             - deleted
 *           properties:
 *             created:
 *               type: array
 *               description: The created rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminPromotionRule"
 *             updated:
 *               type: array
 *               description: The updated rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminPromotionRule"
 *             deleted:
 *               type: object
 *               description: The details of the deleted buy rules.
 *               required:
 *                 - ids
 *                 - object
 *                 - deleted
 *               properties:
 *                 ids:
 *                   type: array
 *                   description: The IDs of the deleted rules.
 *                   items:
 *                     type: string
 *                     title: ids
 *                     description: A rule's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the object that was deleted.
 *                   default: promotion-rule
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the rules were deleted.
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
 * x-workflow: batchPromotionRulesWorkflow
 * 
*/

