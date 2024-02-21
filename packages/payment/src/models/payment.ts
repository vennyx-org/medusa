import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

import {
  BigNumber,
  BigNumberField,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"
import Refund from "./refund"
import Capture from "./capture"
import PaymentSession from "./payment-session"
import PaymentCollection from "./payment-collection"

type OptionalPaymentProps = DAL.EntityDateColumns

@Entity({ tableName: "payment" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Payment {
  [OptionalProps]?: OptionalPaymentProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "numeric" })
  @BigNumberField()
  amount: BigNumber | number

  @Property({ columnType: "numeric", nullable: true })
  @BigNumberField()
  authorized_amount: BigNumber | number | null = null

  @Property({ columnType: "text" })
  currency_code: string

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "text", nullable: true })
  cart_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  order_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  order_edit_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  customer_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

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
  refunds = new Collection<Refund>(this)

  @OneToMany(() => Capture, (capture) => capture.payment, {
    cascade: [Cascade.REMOVE],
  })
  captures = new Collection<Capture>(this)

  @ManyToOne({
    index: "IDX_payment_payment_collection_id",
    fieldName: "payment_collection_id",
    onDelete: "cascade",
  })
  payment_collection!: PaymentCollection

  @OneToOne({ owner: true, fieldName: "session_id" })
  payment_session!: PaymentSession

  /** COMPUTED PROPERTIES START **/

  captured_amount: BigNumber // sum of the associated captures
  refunded_amount: BigNumber // sum of the associated refunds

  /** COMPUTED PROPERTIES END **/

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pay")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "pay")
  }
}
