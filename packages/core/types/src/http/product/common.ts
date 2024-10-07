import { BaseFilterable, OperatorMap } from "../../dal"
import { BaseCollection } from "../collection/common"
import { FindParams } from "../common"
import { BaseCalculatedPriceSet } from "../pricing/common"
import { BaseProductCategory } from "../product-category/common"
import { BaseProductTag } from "../product-tag/common"
import { BaseProductType } from "../product-type/common"

export type ProductStatus = "draft" | "proposed" | "published" | "rejected"
export interface BaseProduct {
  id: string
  title: string
  handle: string
  subtitle: string | null
  description: string | null
  is_giftcard: boolean
  status: ProductStatus
  thumbnail: string | null
  width: number | null
  weight: number | null
  length: number | null
  height: number | null
  origin_country: string | null
  hs_code: string | null
  mid_code: string | null
  material: string | null
  collection?: BaseCollection | null
  collection_id: string | null
  categories?: BaseProductCategory[] | null
  type?: BaseProductType | null
  type_id: string | null
  tags?: BaseProductTag[] | null
  variants: BaseProductVariant[] | null
  options: BaseProductOption[] | null
  images: BaseProductImage[] | null
  discountable: boolean
  external_id: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductVariant {
  id: string
  title: string | null
  sku: string | null
  barcode: string | null
  ean: string | null
  upc: string | null
  allow_backorder: boolean | null
  manage_inventory: boolean | null
  inventory_quantity?: number
  hs_code: string | null
  origin_country: string | null
  mid_code: string | null
  material: string | null
  weight: number | null
  length: number | null
  height: number | null
  width: number | null
  variant_rank?: number | null
  options: BaseProductOptionValue[] | null
  product?: BaseProduct | null
  product_id?: string
  calculated_price?: BaseCalculatedPriceSet
  created_at: string
  updated_at: string
  deleted_at: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductOption {
  id: string
  title: string
  product?: BaseProduct | null
  product_id?: string | null
  values?: BaseProductOptionValue[]
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface BaseProductImage {
  id: string
  url: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductOptionValue {
  id: string
  value: string
  option?: BaseProductOption | null
  option_id?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface BaseProductListParams
  extends FindParams,
    BaseFilterable<BaseProductListParams> {
  q?: string
  status?: ProductStatus | ProductStatus[]
  sales_channel_id?: string | string[]
  title?: string | string[]
  handle?: string | string[]
  id?: string | string[]
  is_giftcard?: boolean
  tags?: string | string[]
  type_id?: string | string[]
  category_id?: string | string[]
  categories?: string | string[]
  collection_id?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface BaseProductOptionParams
  extends FindParams,
    BaseFilterable<BaseProductOptionParams> {
  q?: string
  id?: string | string[]
  title?: string | string[]
  product_id?: string | string[]
}

export interface BaseProductVariantParams
  extends FindParams,
    BaseFilterable<BaseProductVariantParams> {
  q?: string
  id?: string | string[]
  options?: {
    value: string
    option_id: string
  }
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
