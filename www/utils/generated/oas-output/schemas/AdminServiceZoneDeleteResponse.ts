/**
 * @schema AdminServiceZoneDeleteResponse
 * type: object
 * description: The details of the service zone deletion.
 * x-schemaName: AdminServiceZoneDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The service zone's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: "service_zone"
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the service zone was deleted.
 *   parent:
 *     $ref: "#/components/schemas/AdminFulfillmentSet"
 * 
*/

