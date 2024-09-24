/**
 * @oas [get] /admin/inventory-items
 * operationId: GetInventoryItems
 * summary: List Inventory Items
 * description: Retrieve a list of inventory items. The inventory items can be filtered by fields such as `id`. The inventory items can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
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
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: q
 *     in: query
 *     description: The inventory item's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The inventory item's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The inventory item's ID.
 *         - type: array
 *           description: The inventory item's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: sku
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: sku
 *           description: The inventory item's sku.
 *         - type: array
 *           description: The inventory item's sku.
 *           items:
 *             type: string
 *             title: sku
 *             description: The sku's details.
 *   - name: origin_country
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: origin_country
 *           description: The inventory item's origin country.
 *         - type: array
 *           description: The inventory item's origin country.
 *           items:
 *             type: string
 *             title: origin_country
 *             description: The origin country's details.
 *   - name: mid_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: mid_code
 *           description: The inventory item's mid code.
 *         - type: array
 *           description: The inventory item's mid code.
 *           items:
 *             type: string
 *             title: mid_code
 *             description: The mid code's details.
 *   - name: hs_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: hs_code
 *           description: The inventory item's hs code.
 *         - type: array
 *           description: The inventory item's hs code.
 *           items:
 *             type: string
 *             title: hs_code
 *             description: The hs code's details.
 *   - name: material
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: material
 *           description: The inventory item's material.
 *         - type: array
 *           description: The inventory item's material.
 *           items:
 *             type: string
 *             title: material
 *             description: The material's details.
 *   - name: requires_shipping
 *     in: query
 *     description: The inventory item's requires shipping.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: requires_shipping
 *       description: The inventory item's requires shipping.
 *   - name: weight
 *     in: query
 *     description: Filter the inventory item's weight.
 *     required: false
 *     schema:
 *       description: Filter the inventory item's weight.
 *       properties:
 *         $eq:
 *           type: string
 *           description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           description: Filter by values not matching this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array's items.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array's items.
 *           items:
 *             type: string
 *         $like:
 *           type: string
 *           description: Apply a `like` filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           description: Apply a regex filter. Useful for strings only.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *         $gt:
 *           type: string
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *   - name: length
 *     in: query
 *     description: Filter the inventory item's length.
 *     required: false
 *     schema:
 *       description: Filter the inventory item's length.
 *       properties:
 *         $eq:
 *           type: string
 *           description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           description: Filter by values not matching this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array's items.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array's items.
 *           items:
 *             type: string
 *         $like:
 *           type: string
 *           description: Apply a `like` filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           description: Apply a regex filter. Useful for strings only.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *         $gt:
 *           type: string
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *   - name: height
 *     in: query
 *     description: Filter by the inventory item's height.
 *     required: false
 *     schema:
 *       description: Filter by the inventory item's height.
 *       properties:
 *         $eq:
 *           type: string
 *           description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           description: Filter by values not matching this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array's items.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array's items.
 *           items:
 *             type: string
 *         $like:
 *           type: string
 *           description: Apply a `like` filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           description: Apply a regex filter. Useful for strings only.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *         $gt:
 *           type: string
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *   - name: width
 *     in: query
 *     description: Filter by the inventory item's width.
 *     required: false
 *     schema:
 *       description: Filter by the inventory item's width.
 *       properties:
 *         $eq:
 *           type: string
 *           description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           description: Filter by values not matching this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array's items.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array's items.
 *           items:
 *             type: string
 *         $like:
 *           type: string
 *           description: Apply a `like` filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           description: Apply a regex filter. Useful for strings only.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *         $gt:
 *           type: string
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *   - name: location_levels
 *     in: query
 *     description: Filter by the inventory item's associated location IDs.
 *     required: false
 *     schema:
 *       type: object
 *       description: Filter by the inventory item's associated location IDs.
 *       properties:
 *         location_id:
 *           oneOf:
 *             - type: string
 *               title: location_id
 *               description: The associated location's ID.
 *             - type: array
 *               description: The location IDs to retrieve inventory items associated with them.
 *               items:
 *                 type: string
 *                 title: location_id
 *                 description: A location's ID.
 *       required:
 *         - location_id
 *   - name: $and
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/inventory-items' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The inventory item's limit.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The inventory item's offset.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The inventory item's count.
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - inventory_items
 *               properties:
 *                 inventory_items:
 *                   type: array
 *                   description: The inventory item's inventory items.
 *                   items:
 *                     $ref: "#/components/schemas/AdminInventoryItem"
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
 * 
*/

