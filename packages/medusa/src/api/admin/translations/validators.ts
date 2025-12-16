import { applyAndAndOrOperators } from "../../utils/common-validators"
import {
  createBatchBody,
  createFindParams,
  createSelectParams,
} from "../../utils/validators"
import { z } from "zod"

export const AdminGetTranslationParams = createSelectParams()

export const AdminGetTranslationParamsFields = z.object({
  q: z.string().optional(),
  reference_id: z.union([z.string(), z.array(z.string())]).optional(),
  reference: z.string().optional(),
  locale_code: z.string().optional(),
})

export type AdminGetTranslationsParamsType = z.infer<
  typeof AdminGetTranslationsParams
>

export const AdminGetTranslationsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetTranslationParamsFields)
  .merge(applyAndAndOrOperators(AdminGetTranslationParamsFields))

export type AdminCreateTranslationType = z.infer<typeof AdminCreateTranslation>
export const AdminCreateTranslation = z.object({
  reference_id: z.string(),
  reference: z.string(),
  locale_code: z.string(),
  translations: z.record(z.string()),
})

export type AdminUpdateTranslationType = z.infer<typeof AdminUpdateTranslation>
export const AdminUpdateTranslation = z.object({
  id: z.string(),
  reference_id: z.string().optional(),
  reference: z.string().optional(),
  locale_code: z.string().optional(),
  translations: z.record(z.string()).optional(),
})

export type AdminBatchTranslationsType = z.infer<typeof AdminBatchTranslations>
export const AdminBatchTranslations = createBatchBody(
  AdminCreateTranslation,
  AdminUpdateTranslation
)
