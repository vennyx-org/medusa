import { BaseFilterable, OperatorMap } from "../dal"

/**
 * The locale details.
 */
export interface LocaleDTO {
  /**
   * The ID of the locale.
   */
  id: string

  /**
   * The BCP 47 language tag code of the locale (e.g., "en-US", "fr-FR").
   */
  code: string

  /**
   * The human-readable name of the locale (e.g., "English (United States)").
   */
  name: string

  /**
   * The date and time the locale was created.
   */
  created_at: Date | string

  /**
   * The date and time the locale was last updated.
   */
  updated_at: Date | string

  /**
   * The date and time the locale was deleted.
   */
  deleted_at: Date | string | null
}

/**
 * The translation details.
 */
export interface TranslationDTO {
  /**
   * The ID of the translation.
   */
  id: string

  /**
   * The ID of the entity being translated.
   */
  reference_id: string

  /**
   * The type of entity being translated (e.g., "product", "product_variant").
   */
  reference: string

  /**
   * The BCP 47 language tag code for this translation (e.g., "en-US", "fr-FR").
   */
  locale_code: string

  /**
   * The translated fields as key-value pairs.
   */
  translations: Record<string, unknown>

  /**
   * The date and time the translation was created.
   */
  created_at: Date | string

  /**
   * The date and time the translation was last updated.
   */
  updated_at: Date | string

  /**
   * The date and time the translation was deleted.
   */
  deleted_at: Date | string | null
}

/**
 * The filters to apply on the retrieved locales.
 */
export interface FilterableLocaleProps
  extends BaseFilterable<FilterableLocaleProps> {
  /**
   * The IDs to filter the locales by.
   */
  id?: string[] | string | OperatorMap<string | string[]>

  /**
   * Filter locales by their code.
   */
  code?: string | string[] | OperatorMap<string>

  /**
   * Filter locales by their name.
   */
  name?: string | OperatorMap<string>
}

/**
 * The filters to apply on the retrieved translations.
 */
export interface FilterableTranslationProps
  extends BaseFilterable<FilterableTranslationProps> {
  /**
   * Search through translated content using this search term.
   * This searches within the JSONB translations field values.
   */
  q?: string

  /**
   * The IDs to filter the translations by.
   */
  id?: string[] | string | OperatorMap<string | string[]>

  /**
   * Filter translations by entity ID.
   */
  reference_id?: string | string[] | OperatorMap<string>

  /**
   * Filter translations by entity type.
   */
  reference?: string | string[] | OperatorMap<string>

  /**
   * Filter translations by locale code.
   */
  locale_code?: string | string[] | OperatorMap<string>
}
