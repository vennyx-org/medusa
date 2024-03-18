import { AdjustmentLineDTO, TaxLineDTO } from "@medusajs/types"
import { calculateAdjustmentTotal } from "../adjustment"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"
import { calculateTaxTotal } from "../tax"

interface GetLineItemsTotalsContext {
  includeTax?: boolean
}

export interface GetItemTotalInput {
  id: string
  unit_price: BigNumber
  quantity: number
  is_tax_inclusive?: boolean
  tax_lines?: TaxLineDTO[]
  adjustments?: AdjustmentLineDTO[]
}

export interface GetItemTotalOutput {
  quantity: number
  unit_price: BigNumber

  subtotal: BigNumber

  total: BigNumber
  original_total: BigNumber

  discount_total: BigNumber
  discount_tax_total: BigNumber

  tax_total: BigNumber
  original_tax_total: BigNumber
}

export function getLineItemsTotals(
  items: GetItemTotalInput[],
  context: GetLineItemsTotalsContext
) {
  const itemsTotals = {}

  for (const item of items) {
    itemsTotals[item.id] = getLineItemTotals(item, {
      includeTax: context.includeTax,
    })
  }

  return itemsTotals
}

function getLineItemTotals(
  item: GetItemTotalInput,
  context: GetLineItemsTotalsContext
) {
  const subtotal = MathBN.mult(item.unit_price, item.quantity)

  const sumTaxRate = MathBN.sum(
    // @ts-ignore
    (item.tax_lines ?? []).map((taxLine) => taxLine.rate)
  )
  const discountTotal = calculateAdjustmentTotal({
    adjustments: item.adjustments || [],
  })
  const discountTaxTotal = MathBN.mult(discountTotal, sumTaxRate)

  const total = MathBN.sub(subtotal, discountTotal)

  const totals: GetItemTotalOutput = {
    quantity: item.quantity,
    unit_price: item.unit_price,

    subtotal: new BigNumber(subtotal),

    total: new BigNumber(total),
    original_total: new BigNumber(subtotal),

    discount_total: new BigNumber(discountTotal),
    discount_tax_total: new BigNumber(discountTaxTotal),

    tax_total: new BigNumber(0),
    original_tax_total: new BigNumber(0),
  }

  const taxableAmountWithDiscount = MathBN.sub(subtotal, discountTotal)
  const taxableAmount = subtotal

  const taxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    includesTax: context.includeTax,
    taxableAmount: taxableAmountWithDiscount,
  })
  totals.tax_total = new BigNumber(taxTotal)

  const originalTaxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    includesTax: context.includeTax,
    taxableAmount,
  })
  totals.original_tax_total = new BigNumber(originalTaxTotal)

  const isTaxInclusive = context.includeTax ?? item.is_tax_inclusive

  if (isTaxInclusive) {
    const subtotal = MathBN.sub(
      MathBN.mult(item.unit_price, totals.quantity),
      originalTaxTotal
    )

    const subtotalBn = new BigNumber(subtotal)
    totals.subtotal = subtotalBn
    totals.total = subtotalBn
    totals.original_total = subtotalBn
  } else {
    const newTotal = MathBN.add(total, totals.tax_total)
    const originalTotal = MathBN.add(subtotal, totals.original_tax_total)
    totals.total = new BigNumber(newTotal)
    totals.original_total = new BigNumber(originalTotal)
  }

  return totals
}