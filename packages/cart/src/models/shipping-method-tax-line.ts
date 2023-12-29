import { Entity, ManyToOne, Property, Unique } from "@mikro-orm/core"
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "shipping_method_tax_line" })
@Unique({ properties: ["shipping_method_id", "tax_line_id"] })
export class ShippingMethodTaxLine {
  @Property({ columnType: "text" })
  shipping_method_id: string

  @Property({ columnType: "text" })
  tax_line_id: string

  @ManyToOne(() => ShippingMethod, {
    fieldName: "shipping_method_id",
  })
  shipping_method: ShippingMethod

  @ManyToOne(() => TaxLine, {
    fieldName: "tax_line_id",
  })
  tax_line: TaxLine
}
