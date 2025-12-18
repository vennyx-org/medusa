export const PRODUCT_TRANSLATABLE_FIELDS = [
  "title",
  "description",
  "material",
  "subtitle",
]
export const PRODUCT_VARIANT_TRANSLATABLE_FIELDS = ["title", "material"]
export const PRODUCT_TYPE_TRANSLATABLE_FIELDS = ["value"]
export const PRODUCT_COLLECTION_TRANSLATABLE_FIELDS = ["title"]
export const PRODUCT_CATEGORY_TRANSLATABLE_FIELDS = ["name", "description"]
export const PRODUCT_TAG_TRANSLATABLE_FIELDS = ["value"]
export const PRODUCT_OPTION_TRANSLATABLE_FIELDS = ["title"]
export const PRODUCT_OPTION_VALUE_TRANSLATABLE_FIELDS = ["value"]

// export const SHIPPING_OPTION_TRANSLATABLE_FIELDS = ["name"]
// export const SHIPPING_OPTION_TYPE_TRANSLATABLE_FIELDS = ["label", "description"]

// export const RETURN_REASON_TRANSLATABLE_FIELDS = [
//   "value",
//   "label",
//   "description",
// ]

export const translatableFieldsConfig = {
  product: PRODUCT_TRANSLATABLE_FIELDS,
  product_variant: PRODUCT_VARIANT_TRANSLATABLE_FIELDS,
  product_type: PRODUCT_TYPE_TRANSLATABLE_FIELDS,
  product_collection: PRODUCT_COLLECTION_TRANSLATABLE_FIELDS,
  product_category: PRODUCT_CATEGORY_TRANSLATABLE_FIELDS,
  product_tag: PRODUCT_TAG_TRANSLATABLE_FIELDS,
  product_option: PRODUCT_OPTION_TRANSLATABLE_FIELDS,
  product_option_value: PRODUCT_OPTION_VALUE_TRANSLATABLE_FIELDS,

  // shipping_option: SHIPPING_OPTION_TRANSLATABLE_FIELDS,
  // shipping_option_type: SHIPPING_OPTION_TYPE_TRANSLATABLE_FIELDS,

  // return_reason: RETURN_REASON_TRANSLATABLE_FIELDS,
}
