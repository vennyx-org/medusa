/**
 * @oas [get] /admin/products
 * operationId: GetProducts
 * summary: List Products
 * description: Retrieve a list of products. The products can be filtered by fields such as `id`. The products can also be sorted or paginated.
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
 *   - name: price_list_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: price_list_id
 *           description: Filter by a price list's ID to retrieve its associated products.
 *         - type: array
 *           description: The product's price list id.
 *           items:
 *             type: string
 *             title: price_list_id
 *             description: Filter by a price list IDs to retrieve their associated products.
 *   - name: q
 *     in: query
 *     description: Search term to filter a product's searchable properties.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search term to filter a product's searchable properties.
 *   - name: status
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: status
 *           description: Filter by a product status.
 *         - type: array
 *           description: Filter by product statuses.
 *           items:
 *             type: string
 *             enum:
 *               - draft
 *               - proposed
 *               - published
 *               - rejected
 *   - name: sales_channel_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: sales_channel_id
 *           description: Filter by a sales channel's ID to retrieve its associated products.
 *         - type: array
 *           description: Filter by sales channel IDs to retrieve their associated products.
 *           items:
 *             type: string
 *             title: sales_channel_id
 *             description: A sales channel's ID.
 *   - name: title
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: title
 *           description: Filter by a title.
 *         - type: array
 *           description: Filter by titles
 *           items:
 *             type: string
 *             title: title
 *             description: A product title.
 *   - name: handle
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: handle
 *           description: Filter by a handle.
 *         - type: array
 *           description: Filter by handles.
 *           items:
 *             type: string
 *             title: handle
 *             description: A product handle.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: Filter by a product ID.
 *         - type: array
 *           description: Filter by product IDs.
 *           items:
 *             type: string
 *             title: id
 *             description: A product's ID.
 *   - name: is_giftcard
 *     in: query
 *     description: Filter by whether a product is a gift card.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: is_giftcard
 *       description: Filter by whether a product is a gift card.
 *   - name: tags
 *     in: query
 *     description: Filter by associated tags to retrieve their products.
 *     required: false
 *     schema:
 *       description: Filter by associated tags to retrieve their products.
 *       properties:
 *         value:
 *           type: array
 *           description: Filter by tag values.
 *           items:
 *             type: string
 *             title: value
 *             description: A tag's value.
 *   - name: type_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: type_id
 *           description: Filter by a product type's ID to retrieve its associated products.
 *         - type: array
 *           description: Filter by product type IDs to retrieve their associated products.
 *           items:
 *             type: string
 *             title: type_id
 *             description: A product type's ID.
 *   - name: category_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: category_id
 *           description: Filter by a product category's ID to retrieve its associated products.
 *         - type: array
 *           description: Filter by product category IDs to retrieve their associated products.
 *           items:
 *             type: string
 *             title: category_id
 *             description: A product category's ID.
 *   - name: created_at
 *     in: query
 *     description: Filter by a product's creation date.
 *     required: false
 *     schema:
 *       type: object
 *       description: Filter by a product's creation date.
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $and
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $or
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by values not equal to this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array.
 *           items:
 *             type: string
 *             title: $in
 *             description: Filter by values in this array.
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array.
 *           items:
 *             type: string
 *             title: $nin
 *             description: Filter by values not in this array.
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           description: Filter arrays that have overlapping values with this parameter.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: Filter arrays that have overlapping values with this parameter.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *             title: $contains
 *             description: Filter arrays that contain some of the values of this parameter.
 *         $contained:
 *           type: array
 *           description: Filter arrays that contain all values of this parameter.
 *           items:
 *             type: string
 *             title: $contained
 *             description: Filter arrays that contain all values of this parameter.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: updated_at
 *     in: query
 *     description: Filter by a product's update date.
 *     required: false
 *     schema:
 *       type: object
 *       description: Filter by a product's update date.
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $and
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $or
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by values not equal to this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array.
 *           items:
 *             type: string
 *             title: $in
 *             description: Filter by values in this array.
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array.
 *           items:
 *             type: string
 *             title: $nin
 *             description: Filter by values not in this array.
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           description: Filter arrays that have overlapping values with this parameter.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: Filter arrays that have overlapping values with this parameter.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *             title: $contains
 *             description: Filter arrays that contain some of the values of this parameter.
 *         $contained:
 *           type: array
 *           description: Filter arrays that contain all values of this parameter.
 *           items:
 *             type: string
 *             title: $contained
 *             description: Filter arrays that contain all values of this parameter.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: deleted_at
 *     in: query
 *     description: Filter by a product's deletion date.
 *     required: false
 *     schema:
 *       type: object
 *       description: Filter by a product's deletion date.
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $and
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $or
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by values not equal to this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array.
 *           items:
 *             type: string
 *             title: $in
 *             description: Filter by values in this array.
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array.
 *           items:
 *             type: string
 *             title: $nin
 *             description: Filter by values not in this array.
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           description: Filter arrays that have overlapping values with this parameter.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: Filter arrays that have overlapping values with this parameter.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *             title: $contains
 *             description: Filter arrays that contain some of the values of this parameter.
 *         $contained:
 *           type: array
 *           description: Filter arrays that contain all values of this parameter.
 *           items:
 *             type: string
 *             title: $contained
 *             description: Filter arrays that contain all values of this parameter.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 *   - name: collection_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: collection_id
 *           description: Filter by a product collection ID.
 *         - type: array
 *           description: Filter by product collection IDs.
 *           items:
 *             type: string
 *             title: collection_id
 *             description: A product collection's ID.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/products' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The paginated list of products.
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The maximum number of items returned.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The number of items skipped before retrieving the returned items.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The total number of items.
 *             - type: object
 *               description: The paginated list of products.
 *               required:
 *                 - products
 *               properties:
 *                 products:
 *                   type: array
 *                   description: The list of products.
 *                   items:
 *                     $ref: "#/components/schemas/AdminProduct"
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

