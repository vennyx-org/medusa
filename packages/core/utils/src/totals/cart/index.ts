import { BigNumberInput, CartLikeWithTotals } from "@medusajs/types"
import { BigNumber } from "../big-number"
import { GetItemTotalInput, getLineItemsTotals } from "../line-item"
import { MathBN } from "../math"
import {
  GetShippingMethodTotalInput,
  getShippingMethodsTotals,
} from "../shipping-method"
import { transformPropertiesToBigNumber } from "../transform-properties-to-bignumber"

interface TotalsConfig {
  includeTaxes?: boolean
}

export interface DecorateCartLikeInputDTO {
  items?: {
    id?: string
    unit_price: BigNumberInput
    is_tax_inclusive?: boolean
    quantity: BigNumberInput
    adjustments?: { amount: BigNumberInput }[]
    tax_lines?: {
      rate: BigNumberInput
    }[]
  }[]
  shipping_methods?: {
    id?: string
    amount: BigNumberInput
    is_tax_inclusive?: boolean
    adjustments?: { amount: BigNumberInput }[]
    tax_lines?: {
      rate: BigNumberInput
    }[]
  }[]
  region?: {
    automatic_taxes?: boolean
  }
}

export function decorateCartTotals(
  cartLike: DecorateCartLikeInputDTO,
  config: TotalsConfig = {}
): CartLikeWithTotals {
  transformPropertiesToBigNumber(cartLike)

  const optionalFields = {
    "detail.fulfilled_quantity": "fulfilled_total",
    "detail.shipped_quantity": "shipped_total",
    "detail.return_requested_quantity": "return_requested_total",
    "detail.return_received_quantity": "return_received_total",
    "detail.return_dismissed_quantity": "return_dismissed_total",
    "detail.written_off_quantity": "write_off_total",
  }

  const items = (cartLike.items ?? []) as unknown as GetItemTotalInput[]
  const shippingMethods = (cartLike.shipping_methods ??
    []) as unknown as GetShippingMethodTotalInput[]

  const includeTax = config?.includeTaxes || cartLike.region?.automatic_taxes

  const itemsTotals = getLineItemsTotals(items, {
    includeTax,
    extraQuantityFields: optionalFields,
  })

  const shippingMethodsTotals = getShippingMethodsTotals(shippingMethods, {
    includeTax,
  })

  const extraTotals = {}

  let subtotal = MathBN.convert(0)

  let discountTotal = MathBN.convert(0)
  let discountSubtotal = MathBN.convert(0)
  let discountTaxTotal = MathBN.convert(0)

  let itemsSubtotal = MathBN.convert(0)
  let itemsTotal = MathBN.convert(0)

  let itemsOriginalTotal = MathBN.convert(0)
  let itemsOriginalSubtotal = MathBN.convert(0)

  let itemsTaxTotal = MathBN.convert(0)

  let itemsOriginalTaxTotal = MathBN.convert(0)

  let shippingSubtotal = MathBN.convert(0)
  let shippingTotal = MathBN.convert(0)

  let shippingOriginalTotal = MathBN.convert(0)
  let shippingOriginalSubtotal = MathBN.convert(0)

  let shippingTaxTotal = MathBN.convert(0)

  let shippingOriginalTaxTotal = MathBN.convert(0)

  const cartItems = items.map((item, index) => {
    const itemTotals = Object.assign(item, itemsTotals[item.id ?? index] ?? {})
    const itemSubtotal = itemTotals.subtotal

    const itemTotal = MathBN.convert(itemTotals.total)
    const itemOriginalTotal = MathBN.convert(itemTotals.original_total)

    const itemTaxTotal = MathBN.convert(itemTotals.tax_total)
    const itemOriginalTaxTotal = MathBN.convert(itemTotals.original_tax_total)

    const itemDiscountTotal = MathBN.convert(itemTotals.discount_total)
    const itemDiscountSubTotal = MathBN.convert(itemTotals.discount_subtotal)

    const itemDiscountTaxTotal = MathBN.convert(itemTotals.discount_tax_total)

    subtotal = MathBN.add(subtotal, itemSubtotal)

    discountTotal = MathBN.add(discountTotal, itemDiscountTotal)
    discountSubtotal = MathBN.add(discountSubtotal, itemDiscountSubTotal)
    discountTaxTotal = MathBN.add(discountTaxTotal, itemDiscountTaxTotal)

    itemsTotal = MathBN.add(itemsTotal, itemTotal)
    itemsOriginalTotal = MathBN.add(itemsOriginalTotal, itemOriginalTotal)
    itemsOriginalSubtotal = MathBN.add(itemsOriginalSubtotal, itemSubtotal)

    itemsSubtotal = MathBN.add(itemsSubtotal, itemSubtotal)

    itemsTaxTotal = MathBN.add(itemsTaxTotal, itemTaxTotal)

    itemsOriginalTaxTotal = MathBN.add(
      itemsOriginalTaxTotal,
      itemOriginalTaxTotal
    )

    for (const key of Object.values(optionalFields)) {
      if (key in itemTotals) {
        extraTotals[key] ??= MathBN.convert(0)
        extraTotals[key] = MathBN.add(extraTotals[key], itemTotals[key] ?? 0)
      }
    }

    return itemTotals
  })

  const cartShippingMethods = shippingMethods.map((shippingMethod, index) => {
    const shippingMethodTotals = Object.assign(
      shippingMethod,
      shippingMethodsTotals[shippingMethod.id ?? index] ?? {}
    )

    subtotal = MathBN.add(subtotal, shippingMethodTotals.subtotal)

    shippingSubtotal = MathBN.add(
      shippingSubtotal,
      shippingMethodTotals.subtotal
    )

    shippingTotal = MathBN.add(shippingTotal, shippingMethodTotals.total)

    shippingOriginalTotal = MathBN.add(
      shippingOriginalTotal,
      shippingMethodTotals.original_total
    )

    shippingOriginalSubtotal = MathBN.add(
      shippingOriginalSubtotal,
      shippingMethodTotals.subtotal
    )

    shippingTaxTotal = MathBN.add(
      shippingTaxTotal,
      shippingMethodTotals.tax_total
    )

    shippingOriginalTaxTotal = MathBN.add(
      shippingOriginalTaxTotal,
      shippingMethodTotals.original_tax_total
    )

    discountTotal = MathBN.add(
      discountTotal,
      shippingMethodTotals.discount_total
    )

    discountSubtotal = MathBN.add(
      discountSubtotal,
      shippingMethodTotals.discount_subtotal
    )

    discountTaxTotal = MathBN.add(
      discountTaxTotal,
      shippingMethodTotals.discount_tax_total
    )

    return shippingMethodTotals
  })

  const taxTotal = MathBN.add(itemsTaxTotal, shippingTaxTotal)

  const originalTaxTotal = MathBN.add(
    itemsOriginalTaxTotal,
    shippingOriginalTaxTotal
  )

  // TODO: Gift Card calculations
  const originalTotal = MathBN.add(itemsOriginalTotal, shippingOriginalTotal)

  // TODO: subtract (cart.gift_card_total + cart.gift_card_tax_total)
  const tempTotal = MathBN.add(subtotal, taxTotal)
  const total = MathBN.sub(tempTotal, discountSubtotal)
  const cart = cartLike as any

  cart.total = new BigNumber(total)
  cart.subtotal = new BigNumber(subtotal)
  cart.tax_total = new BigNumber(taxTotal)

  cart.discount_total = new BigNumber(discountTotal)
  cart.discount_subtotal = new BigNumber(discountSubtotal)
  cart.discount_tax_total = new BigNumber(discountTaxTotal)

  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  cart.original_total = new BigNumber(originalTotal)
  cart.original_tax_total = new BigNumber(originalTaxTotal)

  // cart.original_gift_card_total =
  // cart.original_gift_card_tax_total =

  if (cartLike.items) {
    cart.items = cartItems
    cart.item_total = new BigNumber(itemsTotal)
    cart.item_subtotal = new BigNumber(itemsSubtotal)
    cart.item_tax_total = new BigNumber(itemsTaxTotal)

    cart.original_item_total = new BigNumber(itemsOriginalTotal)
    cart.original_item_subtotal = new BigNumber(itemsOriginalSubtotal)
    cart.original_item_tax_total = new BigNumber(itemsOriginalTaxTotal)

    for (const key of Object.keys(extraTotals)) {
      cart[key] = new BigNumber(extraTotals[key])
    }
  }

  if (cart.shipping_methods) {
    cart.shipping_methods = cartShippingMethods
    cart.shipping_total = new BigNumber(shippingTotal)
    cart.shipping_subtotal = new BigNumber(shippingSubtotal)
    cart.shipping_tax_total = new BigNumber(shippingTaxTotal)

    cart.original_shipping_tax_total = new BigNumber(shippingOriginalTaxTotal)
    cart.original_shipping_subtotal = new BigNumber(shippingOriginalSubtotal)
    cart.original_shipping_total = new BigNumber(shippingOriginalTotal)
  }

  return cart
}
