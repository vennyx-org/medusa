import { BaseFilterable } from "../../.."
import { FindParams } from "../../common/request"

export interface AdminTranslationsListParams
  extends FindParams,
    BaseFilterable<AdminTranslationsListParams> {
  /**
   * Query or keywords to search the translations searchable fields.
   */
  q?: string
  /**
   * Filter by entity ID.
   * 
   * @example
   * "prod_123"
   */
  reference_id?: string | string[]
  /**
   * Filter by the table of the resource being translated.
   * 
   * @example
   * "product"
   */
  reference?: string
  /**
   * Filter by locale code in BCP 47 format.
   * 
   * @example
   * "en-US"
   */
  locale_code?: string | string[]
}

/**
 * Request body for translation statistics endpoint.
 */
export interface AdminTranslationStatisticsParams {
  /**
   * The locales to check translations for.
   * 
   * @example
   * ["en-US", "fr-FR"]
   */
  locales: string[]

  /**
   * The entity types to get statistics for.
   * 
   * @example
   * ["product", "product_variant"]
   */
  entity_types: string[]
}

/**
 * Query parameters for translation settings endpoint.
 */
export interface AdminTranslationSettingsParams {
  /**
   * The entity type to get the settings for (e.g., "product").
   */
  entity_type?: string
}
