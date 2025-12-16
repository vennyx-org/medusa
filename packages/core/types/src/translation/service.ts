import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableLocaleProps,
  FilterableTranslationProps,
  LocaleDTO,
  TranslationDTO,
} from "./common"
import {
  CreateLocaleDTO,
  CreateTranslationDTO,
  UpdateLocaleDTO,
  UpdateTranslationDTO,
} from "./mutations"

/**
 * The main service interface for the Translation Module.
 * Method signatures match what MedusaService generates.
 */
export interface ITranslationModuleService extends IModuleService {
  /**
   * This method retrieves a locale by its ID.
   *
   * @param {string} id - The ID of the locale.
   * @param {FindConfig<LocaleDTO>} config - The configurations determining how the locale is retrieved.
   * @param {Context} sharedContext
   * @returns {Promise<LocaleDTO>} The retrieved locale.
   */
  retrieveLocale(
    id: string,
    config?: FindConfig<LocaleDTO>,
    sharedContext?: Context
  ): Promise<LocaleDTO>

  /**
   * This method retrieves a paginated list of locales based on optional filters and configuration.
   *
   * @param {FilterableLocaleProps} filters - The filters to apply on the retrieved locales.
   * @param {FindConfig<LocaleDTO>} config - The configurations determining how the locale is retrieved.
   * @param {Context} sharedContext
   * @returns {Promise<LocaleDTO[]>} The list of locales.
   */
  listLocales(
    filters?: FilterableLocaleProps,
    config?: FindConfig<LocaleDTO>,
    sharedContext?: Context
  ): Promise<LocaleDTO[]>

  /**
   * This method retrieves a paginated list of locales along with the total count.
   *
   * @param {FilterableLocaleProps} filters - The filters to apply on the retrieved locales.
   * @param {FindConfig<LocaleDTO>} config - The configurations determining how the locale is retrieved.
   * @param {Context} sharedContext
   * @returns {Promise<[LocaleDTO[], number]>} The list of locales along with their total count.
   */
  listAndCountLocales(
    filters?: FilterableLocaleProps,
    config?: FindConfig<LocaleDTO>,
    sharedContext?: Context
  ): Promise<[LocaleDTO[], number]>

  /**
   * This method creates a locale.
   *
   * @param {CreateLocaleDTO} data - The locale to be created.
   * @param {Context} sharedContext
   * @returns {Promise<LocaleDTO>} The created locale.
   */
  createLocales(
    data: CreateLocaleDTO,
    sharedContext?: Context
  ): Promise<LocaleDTO>

  /**
   * This method creates locales.
   *
   * @param {CreateLocaleDTO[]} data - The locales to be created.
   * @param {Context} sharedContext
   * @returns {Promise<LocaleDTO[]>} The created locales.
   */
  createLocales(
    data: CreateLocaleDTO[],
    sharedContext?: Context
  ): Promise<LocaleDTO[]>

  /**
   * This method updates an existing locale. The ID should be included in the data object.
   *
   * @param {UpdateLocaleDTO} data - The attributes to update in the locale (including id).
   * @param {Context} sharedContext
   * @returns {Promise<LocaleDTO>} The updated locale.
   */
  updateLocales(
    data: UpdateLocaleDTO,
    sharedContext?: Context
  ): Promise<LocaleDTO>

  /**
   * This method updates existing locales using an array or selector-based approach.
   *
   * @param {UpdateLocaleDTO[] | { selector: Record<string, any>; data: UpdateLocaleDTO | UpdateLocaleDTO[] }} dataOrOptions - The data or options for bulk update.
   * @param {Context} sharedContext
   * @returns {Promise<LocaleDTO[]>} The updated locales.
   */
  updateLocales(
    dataOrOptions:
      | UpdateLocaleDTO[]
      | {
          selector: Record<string, any>
          data: UpdateLocaleDTO | UpdateLocaleDTO[]
        },
    sharedContext?: Context
  ): Promise<LocaleDTO[]>

  /**
   * This method deletes locales by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the locales to delete.
   * @param {Context} sharedContext
   * @returns {Promise<void>} Resolves when the locales are deleted.
   */
  deleteLocales(
    primaryKeyValues: string | object | string[] | object[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes locales by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the locales to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object for related entities that should be soft-deleted.
   * @param {Context} sharedContext
   * @returns {Promise<Record<string, string[]> | void>} An object with IDs of related records that were also soft deleted.
   */
  softDeleteLocales<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted locales by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the locales to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore.
   * @param {Context} sharedContext
   * @returns {Promise<Record<string, string[]> | void>} An object with IDs of related records that were restored.
   */
  restoreLocales<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a translation by its ID.
   *
   * @param {string} id - The ID of the translation.
   * @param {FindConfig<TranslationDTO>} config - The configurations determining how the translation is retrieved.
   * @param {Context} sharedContext
   * @returns {Promise<TranslationDTO>} The retrieved translation.
   */
  retrieveTranslation(
    id: string,
    config?: FindConfig<TranslationDTO>,
    sharedContext?: Context
  ): Promise<TranslationDTO>

  /**
   * This method retrieves a paginated list of translations based on optional filters and configuration.
   *
   * @param {FilterableTranslationProps} filters - The filters to apply on the retrieved translations.
   * @param {FindConfig<TranslationDTO>} config - The configurations determining how the translation is retrieved.
   * @param {Context} sharedContext
   * @returns {Promise<TranslationDTO[]>} The list of translations.
   */
  listTranslations(
    filters?: FilterableTranslationProps,
    config?: FindConfig<TranslationDTO>,
    sharedContext?: Context
  ): Promise<TranslationDTO[]>

  /**
   * This method retrieves a paginated list of translations along with the total count.
   *
   * @param {FilterableTranslationProps} filters - The filters to apply on the retrieved translations.
   * @param {FindConfig<TranslationDTO>} config - The configurations determining how the translation is retrieved.
   * @param {Context} sharedContext
   * @returns {Promise<[TranslationDTO[], number]>} The list of translations along with their total count.
   */
  listAndCountTranslations(
    filters?: FilterableTranslationProps,
    config?: FindConfig<TranslationDTO>,
    sharedContext?: Context
  ): Promise<[TranslationDTO[], number]>

  /**
   * This method creates a translation.
   *
   * @param {CreateTranslationDTO} data - The translation to be created.
   * @param {Context} sharedContext
   * @returns {Promise<TranslationDTO>} The created translation.
   */
  createTranslations(
    data: CreateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationDTO>

  /**
   * This method creates translations.
   *
   * @param {CreateTranslationDTO[]} data - The translations to be created.
   * @param {Context} sharedContext
   * @returns {Promise<TranslationDTO[]>} The created translations.
   */
  createTranslations(
    data: CreateTranslationDTO[],
    sharedContext?: Context
  ): Promise<TranslationDTO[]>

  /**
   * This method updates an existing translation. The ID should be included in the data object.
   *
   * @param {UpdateTranslationDTO} data - The attributes to update in the translation (including id).
   * @param {Context} sharedContext
   * @returns {Promise<TranslationDTO>} The updated translation.
   */
  updateTranslations(
    data: UpdateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationDTO>

  /**
   * This method updates existing translations using an array or selector-based approach.
   *
   * @param {UpdateTranslationDTO[] | { selector: Record<string, any>; data: UpdateTranslationDTO | UpdateTranslationDTO[] }} dataOrOptions - The data or options for bulk update.
   * @param {Context} sharedContext
   * @returns {Promise<TranslationDTO[]>} The updated translations.
   */
  updateTranslations(
    dataOrOptions:
      | UpdateTranslationDTO[]
      | {
          selector: Record<string, any>
          data: UpdateTranslationDTO | UpdateTranslationDTO[]
        },
    sharedContext?: Context
  ): Promise<TranslationDTO[]>

  /**
   * This method deletes translations by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the translations to delete.
   * @param {Context} sharedContext
   * @returns {Promise<void>} Resolves when the translations are deleted.
   */
  deleteTranslations(
    primaryKeyValues: string | object | string[] | object[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes translations by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the translations to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object for related entities that should be soft-deleted.
   * @param {Context} sharedContext
   * @returns {Promise<Record<string, string[]> | void>} An object with IDs of related records that were also soft deleted.
   */
  softDeleteTranslations<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted translations by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the translations to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore.
   * @param {Context} sharedContext
   * @returns {Promise<Record<string, string[]> | void>} An object with IDs of related records that were restored.
   */
  restoreTranslations<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
