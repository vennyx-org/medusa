import { BigNumberRawValue, DAL } from "@medusajs/framework/types"
import {
  BigNumber,
  DALUtils,
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import OrderLineItemAdjustment from "./line-item-adjustment"
import OrderLineItemTaxLine from "./line-item-tax-line"

type OptionalLineItemProps = DAL.ModelDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ProductIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item",
  columns: "product_id",
  where: "deleted_at IS NOT NULL",
})

const VariantIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item",
  columns: "variant_id",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_line_item" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class OrderLineItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  subtitle: string | null = null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  @VariantIdIndex.MikroORMIndex()
  variant_id: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  @ProductIdIndex.MikroORMIndex()
  product_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_title: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_description: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_subtitle: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_type: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_collection: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_handle: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_sku: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_barcode: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_title: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  variant_option_values: Record<string, unknown> | null = null

  @Property({ columnType: "boolean" })
  requires_shipping: boolean = true

  @Property({ columnType: "boolean" })
  is_discountable: boolean = true

  @Property({ columnType: "boolean" })
  is_tax_inclusive: boolean = false

  @MikroOrmBigNumberProperty({
    nullable: true,
  })
  compare_at_unit_price?: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_compare_at_unit_price: BigNumberRawValue | null = null

  @MikroOrmBigNumberProperty({
    nullable: true,
  })
  unit_price: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_unit_price: BigNumberRawValue

  @Property({ columnType: "boolean", default: false })
  is_custom_price: boolean = false

  @OneToMany(() => OrderLineItemTaxLine, (taxLine) => taxLine.item, {
    cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
  })
  tax_lines = new Collection<Rel<OrderLineItemTaxLine>>(this)

  @OneToMany(() => OrderLineItemAdjustment, (adjustment) => adjustment.item, {
    cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
  })
  adjustments = new Collection<Rel<OrderLineItemAdjustment>>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Property({ columnType: "timestamptz", nullable: true })
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordli")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordli")
  }
}
