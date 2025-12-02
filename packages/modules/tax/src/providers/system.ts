import { ITaxProvider, TaxTypes } from "@medusajs/framework/types"

export default class SystemTaxService implements ITaxProvider {
  static identifier = "system"

  getIdentifier(): string {
    return SystemTaxService.identifier
  }

  async getTaxLines(
    itemLines: TaxTypes.ItemTaxCalculationLine[],
    shippingLines: TaxTypes.ShippingTaxCalculationLine[],
    _: TaxTypes.TaxCalculationContext
  ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
    let taxLines: (TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[] = []

    // Process item lines - ensuring proper order for compound taxes
    for (const l of itemLines) {
      // Sort rates: non-compound first, then compound ones
      // This ensures compound taxes are applied after regular taxes
      const sortedRates = [...l.rates].sort((a, b) => {
        if (a.is_compound === b.is_compound) return 0
        return a.is_compound ? 1 : -1
      })

      for (const r of sortedRates) {
        taxLines.push({
          rate_id: r.id,
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          line_item_id: l.line_item.id,
          provider_id: this.getIdentifier(),
          is_compound: r.is_compound || false,
        })
      }
    }

    // Process shipping lines - also ensuring proper tax order
    for (const l of shippingLines) {
      // Sort rates: non-compound first, then compound ones
      const sortedRates = [...l.rates].sort((a, b) => {
        if (a.is_compound === b.is_compound) return 0
        return a.is_compound ? 1 : -1
      })

      for (const r of sortedRates) {
        taxLines.push({
          rate_id: r.id,
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          shipping_line_id: l.shipping_line.id,
          provider_id: this.getIdentifier(),
          is_compound: r.is_compound || false,
        })
      }
    }

    return taxLines
  }
}
