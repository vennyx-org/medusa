export interface AdminTranslation {
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
