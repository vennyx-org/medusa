import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  Searchable,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { Product, ProductOptionValue } from "@models"

const variantSkuIndexName = "IDX_product_variant_sku_unique"
const variantSkuIndexStatement = createPsqlIndexStatementHelper({
  name: variantSkuIndexName,
  tableName: "product_variant",
  columns: ["sku"],
  unique: true,
  where: "deleted_at IS NULL",
})

const variantBarcodeIndexName = "IDX_product_variant_barcode_unique"
const variantBarcodeIndexStatement = createPsqlIndexStatementHelper({
  name: variantBarcodeIndexName,
  tableName: "product_variant",
  columns: ["barcode"],
  unique: true,
  where: "deleted_at IS NULL",
})

const variantEanIndexName = "IDX_product_variant_ean_unique"
const variantEanIndexStatement = createPsqlIndexStatementHelper({
  name: variantEanIndexName,
  tableName: "product_variant",
  columns: ["ean"],
  unique: true,
  where: "deleted_at IS NULL",
})

const variantUpcIndexName = "IDX_product_variant_upc_unique"
const variantUpcIndexStatement = createPsqlIndexStatementHelper({
  name: variantUpcIndexName,
  tableName: "product_variant",
  columns: ["upc"],
  unique: true,
  where: "deleted_at IS NULL",
})

const variantProductIdIndexName = "IDX_product_variant_product_id"
const variantProductIdIndexStatement = createPsqlIndexStatementHelper({
  name: variantProductIdIndexName,
  tableName: "product_variant",
  columns: ["product_id"],
  unique: false,
  where: "deleted_at IS NULL",
})

variantProductIdIndexStatement.MikroORMIndex()
variantSkuIndexStatement.MikroORMIndex()
variantBarcodeIndexStatement.MikroORMIndex()
variantEanIndexStatement.MikroORMIndex()
variantUpcIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_variant" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductVariant {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text" })
  title: string

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  sku?: string | null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  barcode?: string | null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  ean?: string | null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  upc?: string | null

  @Property({ columnType: "boolean", default: false })
  allow_backorder?: boolean = false

  @Property({ columnType: "boolean", default: true })
  manage_inventory?: boolean = true

  @Property({ columnType: "text", nullable: true })
  hs_code?: string | null

  @Property({ columnType: "text", nullable: true })
  origin_country?: string | null

  @Property({ columnType: "text", nullable: true })
  mid_code?: string | null

  @Property({ columnType: "text", nullable: true })
  material?: string | null

  @Property({ columnType: "numeric", nullable: true })
  weight?: number | null

  @Property({ columnType: "numeric", nullable: true })
  length?: number | null

  @Property({ columnType: "numeric", nullable: true })
  height?: number | null

  @Property({ columnType: "numeric", nullable: true })
  width?: number | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({
    columnType: "integer",
    nullable: true,
    default: 0,
  })
  variant_rank?: number | null

  @ManyToOne(() => Product, {
    columnType: "text",
    nullable: true,
    onDelete: "cascade",
    fieldName: "product_id",
    mapToPk: true,
  })
  product_id: string | null

  @ManyToOne(() => Product, {
    persist: false,
    nullable: true,
  })
  product: Product | null

  @ManyToMany(() => ProductOptionValue, "variants", {
    owner: true,
    pivotTable: "product_variant_option",
    joinColumn: "variant_id",
    inverseJoinColumn: "option_value_id",
  })
  options = new Collection<ProductOptionValue>(this)

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

  @Index({ name: "IDX_product_variant_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @OnInit()
  @BeforeCreate()
  onInit() {
    this.id = generateEntityId(this.id, "variant")
    this.product_id ??= this.product?.id ?? null
  }
}

export default ProductVariant
