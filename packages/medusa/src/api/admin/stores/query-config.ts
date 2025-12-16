export const defaultAdminStoreFields = [
  "id",
  "name",
  "*supported_currencies",
  "*supported_currencies.currency",
  "*supported_locales",
  "*supported_locales.locale_code",
  "default_sales_channel_id",
  "default_region_id",
  "default_location_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminStoreFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
