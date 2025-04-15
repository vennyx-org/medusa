import { BigNumberInput, ItemTaxLineDTO } from "@medusajs/types"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"

export function calculateTaxTotal({
  taxLines,
  taxableAmount,
  setTotalField,
}: {
  taxLines: any[]
  taxableAmount: BigNumberInput
  setTotalField?: string
}) {
  if (MathBN.lte(taxableAmount, 0)) {
    return MathBN.convert(0)
  }

  let taxTotal = MathBN.convert(0)
  let baseWithTax = MathBN.convert(taxableAmount)

  // First process all non-compound taxes (like SCT)
  const standardTaxLines = taxLines.filter(taxLine => !taxLine.is_compound);
  const compoundTaxLines = taxLines.filter(taxLine => taxLine.is_compound);

  // Calculate regular taxes
  for (const taxLine of standardTaxLines) {
    const rate = MathBN.div(taxLine.rate, 100)
    let taxAmount = MathBN.mult(taxableAmount, rate)

    if (setTotalField) {
      ;(taxLine as any)[setTotalField] = new BigNumber(taxAmount)
    }

    taxTotal = MathBN.add(taxTotal, taxAmount)
    baseWithTax = MathBN.add(baseWithTax, taxAmount) // Add tax to base for compound calculation
  }

  // Calculate compound taxes (like VAT on SCT)
  for (const taxLine of compoundTaxLines) {
    const rate = MathBN.div(taxLine.rate, 100)
    // Apply to price INCLUDING other taxes
    let taxAmount = MathBN.mult(baseWithTax, rate)

    if (setTotalField) {
      ;(taxLine as any)[setTotalField] = new BigNumber(taxAmount)
    }

    taxTotal = MathBN.add(taxTotal, taxAmount)
  }

  return taxTotal
}

export function calculateAmountsWithTax({
  taxLines,
  amount,
  includesTax,
}: {
  taxLines: ItemTaxLineDTO[]
  amount: number
  includesTax?: boolean
}) {
  // Split tax lines into standard and compound
  const standardTaxLines = taxLines.filter(taxLine => !taxLine.is_compound);
  const compoundTaxLines = taxLines.filter(taxLine => taxLine.is_compound);

  // Calculate sum of standard tax rates
  const sumStandardTaxRate = MathBN.div(
    MathBN.sum(...((standardTaxLines ?? []).map((taxLine) => taxLine.rate) ?? [])),
    100
  )

  // Handle tax-inclusive pricing differently
  if (includesTax) {
    // Complex case: need to back-calculate from tax-inclusive amount with compound taxes
    
    // Calculate compound tax rates sum
    let compoundRateSum = MathBN.convert(0);
    for (const taxLine of compoundTaxLines) {
      compoundRateSum = MathBN.add(compoundRateSum, MathBN.div(taxLine.rate, 100))
    }
    
    // Formula for extracting base amount from tax-inclusive pricing with compound tax
    const taxableAmount = MathBN.div(
      amount, 
      MathBN.add(1, MathBN.add(sumStandardTaxRate, compoundRateSum))
    )
    
    const tax = calculateTaxTotal({
      taxLines,
      taxableAmount,
    })
    
    return {
      priceWithTax: amount,
      priceWithoutTax: MathBN.sub(amount, tax).toNumber(),
    }
  } else {
    // Tax exclusive pricing is easier - we just calculate tax normally
    const taxableAmount = amount
    
    const tax = calculateTaxTotal({
      taxLines,
      taxableAmount,
    })
    
    return {
      priceWithTax: MathBN.add(amount, tax).toNumber(),
      priceWithoutTax: amount,
    }
  }
}
