/**
 * The locale to be created.
 */
export interface CreateLocaleDTO {
  /**
   * The ID of the locale to create.
   */
  id?: string

  /**
   * The BCP 47 language tag code of the locale (e.g., "en-US", "fr-FR").
   */
  code: string

  /**
   * The human-readable name of the locale (e.g., "English (United States)").
   */
  name: string
}

/**
 * The attributes to update in the locale.
 */
export interface UpdateLocaleDTO {
  /**
   * The ID of the locale to update.
   */
  id: string

  /**
   * The BCP 47 language tag code of the locale.
   */
  code?: string

  /**
   * The human-readable name of the locale.
   */
  name?: string
}

/**
 * The attributes in the locale to be created or updated.
 */
export interface UpsertLocaleDTO {
  /**
   * The ID of the locale in case of an update.
   */
  id?: string

  /**
   * The BCP 47 language tag code of the locale.
   */
  code?: string

  /**
   * The human-readable name of the locale.
   */
  name?: string
}

/**
 * The translation to be created.
 */
export interface CreateTranslationDTO {
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
}

/**
 * The attributes to update in the translation.
 */
export interface UpdateTranslationDTO {
  /**
   * The ID of the translation to update.
   */
  id: string

  /**
   * The ID of the entity being translated.
   */
  reference_id?: string

  /**
   * The type of entity being translated.
   */
  reference?: string

  /**
   * The BCP 47 language tag code for this translation.
   */
  locale_code?: string

  /**
   * The translated fields as key-value pairs.
   */
  translations?: Record<string, unknown>
}

/**
 * The attributes in the translation to be created or updated.
 */
export interface UpsertTranslationDTO {
  /**
   * The ID of the translation in case of an update.
   */
  id?: string

  /**
   * The ID of the entity being translated.
   */
  reference_id?: string

  /**
   * The type of entity being translated.
   */
  reference?: string

  /**
   * The BCP 47 language tag code for this translation.
   */
  locale_code?: string

  /**
   * The translated fields as key-value pairs.
   */
  translations?: Record<string, unknown>
}
