export interface AdminTranslation {
  /**
   * The ID of the translation.
   */
  id: string

  /**
   * The ID of the entity being translated.
   * 
   * @example
   * "prod_123"
   */
  reference_id: string

  /**
   * The name of the table that the translation belongs to.
   * 
   * @example
   * "product"
   */
  reference: string

  /**
   * The BCP 47 language tag code for this translation.
   * 
   * @example
   * "en-US"
   */
  locale_code: string

  /**
   * The translations of the resource.
   * The object's keys are the field names of the data model, and its value is the translated value.
   * 
   * @example
   * {
   *   "title": "Product Title",
   *   "description": "Product Description",
   * }
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
