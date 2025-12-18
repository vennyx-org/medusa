import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Translation {
  /**
   * @ignore
   */
  private client: Client

  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves a paginated list of translations. It sends a request to the
   * [List Translations](https://docs.medusajs.com/api/admin#translations_gettranslations)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of translations.
   *
   * @example
   * To retrieve the list of translations:
   *
   * ```ts
   * sdk.admin.translation.list()
   * .then(({ translations, count, limit, offset }) => {
   *   console.log(translations)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.translation.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ translations, count, limit, offset }) => {
   *   console.log(translations)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each translation:
   *
   * ```ts
   * sdk.admin.translation.list({
   *   fields: "id,name"
   * })
   * .then(({ translations, count, limit, offset }) => {
   *   console.log(translations)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminTranslationsListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationsListResponse>(
      `/admin/translations`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method allows bulk operations on translations. It sends a request to the
   * [Manage Translations](https://docs.medusajs.com/api/admin#translations_posttranslationsbatch)
   * API route.
   *
   * @param payload - The translations to create, update, or delete.
   * @param headers - Headers to pass in the request.
   * @returns The translations' details.
   *
   * @example
   * sdk.admin.translation.batch({
   *   create: [
   *     {
   *       reference_id: "prod_123",
   *       reference: "product",
   *       locale_code: "en-US",
   *       translations: { title: "Shirt" }
   *     }
   *   ],
   *   update: [
   *     {
   *       id: "trans_123",
   *       translations: { title: "Pants" }
   *     }
   *   ],
   *   delete: ["trans_321"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   * ```
   */
  async batch(body: HttpTypes.AdminBatchTranslations, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminTranslationsBatchResponse>(
      `/admin/translations/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method retrieves the settings for the translations for a given entity type or all entity types if no entity type is provided.
   * It sends a request to the
   * [Get Translation Settings](https://docs.medusajs.com/api/admin#translations_gettranslationssettings) API route.
   *
   * @param query - The query parameters which can optionally include the entity type to get the settings for.
   * @param headers - Headers to pass in the request.
   * @returns The translation settings.
   *
   * @example
   * To retrieve the settings for the translations for a given entity type:
   *
   * ```ts
   * sdk.admin.translation.settings({
   *   entity_type: "product"
   * })
   * .then(({ translatable_fields }) => {
   *   console.log(translatable_fields)
   * })
   * ```
   *
   * To retrieve the settings for all entity types:
   *
   * ```ts
   * sdk.admin.translation.settings()
   * .then(({ translatable_fields }) => {
   *   console.log(translatable_fields)
   * })
   * ```
   */
  async settings(
    query?: HttpTypes.AdminTranslationSettingsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationSettingsResponse>(
      `/admin/translations/settings`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves the statistics for the translations for a given entity type or all entity types if no entity type is provided.
   * It sends a request to the
   * [Get Translation Statistics](https://docs.medusajs.com/api/admin#translations_gettranslationsstatistics) API route.
   *
   * @param query - The query parameters which can optionally include the entity type to get the statistics for.
   * @param headers - Headers to pass in the request.
   * @returns The translation statistics.
   *
   * @example
   * To retrieve the statistics for the translations for a given entity type:
   *
   * ```ts
   * sdk.admin.translation.statistics({
   *   entity_type: "product"
   * })
   * .then(({ statistics }) => {
   *   console.log(statistics)
   * })
   * ```
   *
   * To retrieve the statistics for all entity types:
   *
   * ```ts
   * sdk.admin.translation.statistics()
   * .then(({ statistics }) => {
   *   console.log(statistics)
   * })
   * ```
   */
  async statistics(
    query?: HttpTypes.AdminTranslationStatisticsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationStatisticsResponse>(
      `/admin/translations/statistics`,
      {
        headers,
        query,
      }
    )
  }
}
