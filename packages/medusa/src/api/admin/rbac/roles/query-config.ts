export const defaultAdminRbacRoleFields = [
  "id",
  "name",
  "parent_id",
  "description",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRbacRoleFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
}

export const defaultAdminRolePoliciesFields = [
  "id",
  "role_id",
  "policy_id",
  "policy",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveRolePoliciesTransformQueryConfig = {
  defaults: defaultAdminRolePoliciesFields,
  isList: false,
}

export const listRolePoliciesTransformQueryConfig = {
  ...retrieveRolePoliciesTransformQueryConfig,
  isList: true,
}
