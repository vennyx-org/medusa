/**
 * @schema BaseOrderSummary
 * type: object
 * description: The order's summary details.
 * x-schemaName: BaseOrderSummary
 * required:
 *   - total
 *   - subtotal
 *   - total_tax
 *   - ordered_total
 *   - fulfilled_total
 *   - returned_total
 *   - return_request_total
 *   - write_off_total
 *   - projected_total
 *   - net_total
 *   - net_subtotal
 *   - net_total_tax
 *   - balance
 *   - paid_total
 *   - refunded_total
 * properties:
 *   total:
 *     type: number
 *     title: total
 *     description: The order's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The order's total excluding taxes, including promotions.
 *   total_tax:
 *     type: number
 *     title: total_tax
 *     description: The order's total taxes.
 *   ordered_total:
 *     type: number
 *     title: ordered_total
 *     description: The order's total when it was placed.
 *   fulfilled_total:
 *     type: number
 *     title: fulfilled_total
 *     description: The total of the fulfilled items of the order.
 *   returned_total:
 *     type: number
 *     title: returned_total
 *     description: The total of the order's returned items.
 *   return_request_total:
 *     type: number
 *     title: return_request_total
 *     description: The total of the items requested to be returned.
 *   write_off_total:
 *     type: number
 *     title: write_off_total
 *     description: The total of the items removed from the order.
 *   projected_total:
 *     type: number
 *     title: projected_total
 *     description: The summary's projected total.
 *   net_total:
 *     type: number
 *     title: net_total
 *     description: The summary's net total.
 *   net_subtotal:
 *     type: number
 *     title: net_subtotal
 *     description: The summary's net subtotal.
 *   net_total_tax:
 *     type: number
 *     title: net_total_tax
 *     description: The summary's net total tax.
 *   balance:
 *     type: number
 *     title: balance
 *     description: The summary's balance.
 *   paid_total:
 *     type: number
 *     title: paid_total
 *     description: The total amount paid.
 *   refunded_total:
 *     type: number
 *     title: refunded_total
 *     description: The total amount refunded.
 * 
*/

