import { BigNumberRawValue, DAL } from "@medusajs/framework/types"
import {
  BigNumber,
  DALUtils,
  MikroOrmBigNumberProperty,
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import Capture from "./capture"
import PaymentCollection from "./payment-collection"
import PaymentSession from "./payment-session"
import Refund from "./refund"

type OptionalPaymentProps = DAL.ModelDateColumns

const tableName = "payment"
const ProviderIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "provider_id",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Payment {
  [OptionalProps]?: OptionalPaymentProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "text" })
  currency_code: string

  @Property({ columnType: "text" })
  @ProviderIdIndex.MikroORMIndex()
  provider_id: string

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  cart_id: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  order_id: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  customer_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

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

  @Property({
    columnType: "timestamptz",
    nullable: true,
    index: "IDX_payment_deleted_at",
  })
  deleted_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  captured_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  canceled_at: Date | null = null

  @OneToMany(() => Refund, (refund) => refund.payment, {
    cascade: [Cascade.REMOVE],
  })
  refunds = new Collection<Rel<Refund>>(this)

  @OneToMany(() => Capture, (capture) => capture.payment, {
    cascade: [Cascade.REMOVE],
  })
  captures = new Collection<Rel<Capture>>(this)

  @ManyToOne({
    entity: () => PaymentCollection,
    persist: false,
  })
  payment_collection: Rel<PaymentCollection>

  @ManyToOne({
    entity: () => PaymentCollection,
    columnType: "text",
    index: "IDX_payment_payment_collection_id",
    fieldName: "payment_collection_id",
    mapToPk: true,
  })
  payment_collection_id: string

  @OneToOne({
    entity: () => PaymentSession,
    owner: true,
    fieldName: "payment_session_id",
    index: "IDX_payment_payment_session_id",
  })
  payment_session: Rel<PaymentSession>

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pay")
    this.payment_collection_id ??=
      this.payment_collection_id ?? this.payment_collection?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "pay")
    this.payment_collection_id ??=
      this.payment_collection_id ?? this.payment_collection?.id
  }
}
