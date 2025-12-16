export enum PriceListRelations {
  PRICES = "prices",
}

// Note: renamed to avoid referencing remoteQuery which is legacy
export const adminPriceListPriceQueryFields = [
  "id",
  "currency_code",
  "amount",
  "min_quantity",
  "max_quantity",
  "created_at",
  "deleted_at",
  "updated_at",
  "price_set.variant.id",
  "price_rules.value",
  "price_rules.attribute",
]

export const adminPriceListRemoteQueryFields = [
  "id",
  "type",
  "description",
  "title",
  "status",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "price_list_rules.value",
  "price_list_rules.attribute",
]

export const retrivePriceListPriceQueryConfig = {
  defaults: adminPriceListPriceQueryFields,
  isList: false,
}

export const listPriceListPriceQueryConfig = {
  ...retrivePriceListPriceQueryConfig,
  isList: true,
}

export const retrivePriceListQueryConfig = {
  defaults: adminPriceListRemoteQueryFields,
  isList: false,
}

export const listPriceListQueryConfig = {
  ...retrivePriceListQueryConfig,
  isList: true,
}
