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
   */
  reference_id?: string | string[]
  /**
   * Filter by entity type.
   */
  reference?: string
  /**
   * Filter by locale code.
   */
  locale_code?: string | string[]
}
