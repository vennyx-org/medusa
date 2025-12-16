export const defaultAdminLocaleFields = ["code", "name"]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminLocaleFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 200,
  isList: true,
}
