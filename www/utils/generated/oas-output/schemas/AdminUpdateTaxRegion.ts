/**
 * @schema AdminUpdateTaxRegion
 * type: object
 * description: The details to update in a tax region.
 * x-schemaName: AdminUpdateTaxRegion
 * properties:
 *   province_code:
 *     type: string
 *     title: province_code
 *     description: The tax region's ISO 3166-2 province code. Must be lower-case.
 *     example: "us-ca"
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-2
 *       description: Learn more about ISO 3166-2
 *   metadata:
 *     type: object
 *     description: The tax region's metadata, can hold custom key-value pairs.
 * 
*/

