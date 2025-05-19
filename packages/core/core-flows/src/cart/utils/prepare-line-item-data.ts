import {
  BigNumberInput,
  CreateOrderAdjustmentDTO,
  CreateOrderLineItemTaxLineDTO,
  InventoryItemDTO,
  LineItemAdjustmentDTO,
  LineItemTaxLineDTO,
  ProductVariantDTO,
} from "@medusajs/framework/types"
import {
  isDefined,
  isPresent,
  MathBN,
  PriceListType,
} from "@medusajs/framework/utils"

interface PrepareItemLineItemInput {
  title?: string
  subtitle?: string
  thumbnail?: string
  quantity: BigNumberInput

  product_id?: string
  product_title?: string
  product_description?: string
  product_subtitle?: string
  product_type?: string
  product_type_id?: string
  product_collection?: string
  product_handle?: string

  variant_id?: string
  variant_sku?: string
  variant_barcode?: string
  variant_title?: string
  variant_option_values?: Record<string, unknown>

  requires_shipping?: boolean

  is_discountable?: boolean
  is_tax_inclusive?: boolean

  raw_compare_at_unit_price?: BigNumberInput
  compare_at_unit_price?: BigNumberInput
  unit_price?: BigNumberInput

  tax_lines?: LineItemTaxLineDTO[]
  adjustments?: LineItemAdjustmentDTO[]
  cart_id?: string
  metadata?: Record<string, unknown> | null
}

export interface PrepareVariantLineItemInput extends ProductVariantDTO {
  inventory_items: { inventory: InventoryItemDTO }[]
  calculated_price: {
    calculated_price: {
      price_list_type: string
    }
    is_calculated_price_tax_inclusive: boolean
    original_amount: BigNumberInput
    calculated_amount: BigNumberInput
  }
}

export interface PrepareLineItemDataInput {
  item?: PrepareItemLineItemInput
  isCustomPrice?: boolean
  variant?: PrepareVariantLineItemInput
  taxLines?: CreateOrderLineItemTaxLineDTO[]
  adjustments?: CreateOrderAdjustmentDTO[]
  cartId?: string
  unitPrice?: BigNumberInput
  isTaxInclusive: boolean
}

export function prepareLineItemData(data: PrepareLineItemDataInput) {
  const {
    item,
    variant,
    cartId,
    taxLines,
    adjustments,
    isCustomPrice,
    unitPrice,
    isTaxInclusive,
  } = data

  if (variant && !variant.product) {
    throw new Error("Variant does not have a product")
  }

  let compareAtUnitPrice = item?.compare_at_unit_price

  const isSalePrice =
    variant?.calculated_price?.calculated_price?.price_list_type ===
    PriceListType.SALE

  if (
    !isPresent(compareAtUnitPrice) &&
    isSalePrice &&
    !MathBN.eq(
      variant.calculated_price?.original_amount,
      variant.calculated_price?.calculated_amount
    )
  ) {
    compareAtUnitPrice = variant.calculated_price.original_amount
  }

  // Note: If any of the items require shipping, we enable fulfillment
  // unless explicitly set to not require shipping by the item in the request
  const someInventoryRequiresShipping = variant?.inventory_items?.length
    ? variant.inventory_items.some(
      (inventoryItem) => !!inventoryItem.inventory.requires_shipping
    )
    : true

  const requiresShipping = isDefined(item?.requires_shipping)
    ? item.requires_shipping
    : someInventoryRequiresShipping

  let lineItem: any = {
    quantity: item?.quantity,
    title: variant?.title ?? item?.title,
    subtitle: variant?.product?.title ?? item?.subtitle,
    thumbnail: variant?.product?.thumbnail ?? item?.thumbnail,

    product_id: variant?.product?.id ?? item?.product_id,
    product_title: variant?.product?.title ?? item?.product_title,
    product_description:
      variant?.product?.description ?? item?.product_description,
    product_subtitle: variant?.product?.subtitle ?? item?.product_subtitle,
    product_type: variant?.product?.type?.value ?? item?.product_type ?? null,
    product_type_id:
      variant?.product?.type?.id ?? item?.product_type_id ?? null,
    product_collection:
      variant?.product?.collection?.title ?? item?.product_collection ?? null,
    product_handle: variant?.product?.handle ?? item?.product_handle,

    variant_id: variant?.id,
    variant_sku: variant?.sku ?? item?.variant_sku,
    variant_barcode: variant?.barcode ?? item?.variant_barcode,
    variant_title: variant?.title ?? item?.variant_title,
    variant_option_values: item?.variant_option_values,

    is_discountable: variant?.product?.discountable ?? item?.is_discountable,
    requires_shipping: requiresShipping,

    unit_price: unitPrice,
    compare_at_unit_price: compareAtUnitPrice,
    is_tax_inclusive: !!isTaxInclusive,

    metadata: item?.metadata ?? {},
  }

  if (isCustomPrice) {
    lineItem.is_custom_price = !!isCustomPrice
  }

  if (taxLines) {
    lineItem.tax_lines = prepareTaxLinesData(taxLines)
  }

  if (adjustments) {
    lineItem.adjustments = prepareAdjustmentsData(adjustments)
  }

  if (cartId) {
    lineItem.cart_id = cartId
  }

  return lineItem
}

export function prepareTaxLinesData(data: CreateOrderLineItemTaxLineDTO[]) {
  return data.map((d) => ({
    description: d.description,
    tax_rate_id: d.tax_rate_id,
    code: d.code,
    rate: d.rate,
    provider_id: d.provider_id,
    is_compound: d.is_compound,
  }))
}

export function prepareAdjustmentsData(data: CreateOrderAdjustmentDTO[]) {
  return data.map((d) => ({
    code: d.code,
    amount: d.amount,
    description: d.description,
    promotion_id: d.promotion_id,
    provider_id: d.promotion_id,
    is_compound: d.is_compound,
  }))
}
