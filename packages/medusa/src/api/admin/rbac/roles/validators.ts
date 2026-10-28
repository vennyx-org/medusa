import { z } from "zod"
import { applyAndAndOrOperators } from "../../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../../utils/validators"

export type AdminGetRbacRoleParamsType = z.infer<typeof AdminGetRbacRoleParams>
export const AdminGetRbacRoleParams = createSelectParams().merge(
  z.object({
    policies: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export const AdminGetRbacRolesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  parent_id: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetRbacRolesParamsType = z.infer<
  typeof AdminGetRbacRolesParams
>
export const AdminGetRbacRolesParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetRbacRolesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetRbacRolesParamsFields))

export type AdminCreateRbacRoleType = z.infer<typeof AdminCreateRbacRole>
export const AdminCreateRbacRole = z
  .object({
    name: z.string(),
    parent_id: z.string().nullish(),
    description: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateRbacRoleType = z.infer<typeof AdminUpdateRbacRole>
export const AdminUpdateRbacRole = z
  .object({
    name: z.string().optional(),
    parent_id: z.string().nullish(),
    description: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const AdminAddRolePoliciesType = z.object({
  policies: z.array(z.string().min(1)).min(1),
})

export type AdminAddRolePoliciesType = z.infer<typeof AdminAddRolePoliciesType>
