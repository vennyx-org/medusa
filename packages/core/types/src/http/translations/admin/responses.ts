import { PaginatedResponse } from "../../common"
import { AdminTranslation } from "./entities"

export interface AdminTranslationsResponse {
  /**
   * The list of translations.
   */
  translation: AdminTranslation
}

export type AdminTranslationsListResponse = PaginatedResponse<{
  /**
   * The list of translations.
   */
  translations: AdminTranslation[]
}>

export interface AdminTranslationsBatchResponse {
  /**
   * The created translations.
   */
  created: AdminTranslation[]
  /**
   * The updated translations.
   */
  updated: AdminTranslation[]
  /**
   * The deleted translations.
   */
  deleted: {
    ids: string[]
    object: "translation"
    deleted: boolean
  }
}
