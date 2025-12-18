import { raw } from "@medusajs/framework/mikro-orm/core"
import {
  Context,
  CreateTranslationDTO,
  DAL,
  FilterableTranslationProps,
  FindConfig,
  ITranslationModuleService,
  LocaleDTO,
  ModulesSdkTypes,
  TranslationTypes,
} from "@medusajs/framework/types"
import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import {
  EmitEvents,
  InjectManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  normalizeLocale,
} from "@medusajs/framework/utils"
import Locale from "@models/locale"
import Translation from "@models/translation"
import { computeTranslatedFieldCount } from "@utils/compute-translated-field-count"
import { TRANSLATABLE_FIELDS_CONFIG_KEY } from "@utils/constants"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  translationService: ModulesSdkTypes.IMedusaInternalService<typeof Translation>
  localeService: ModulesSdkTypes.IMedusaInternalService<typeof Locale>
  [TRANSLATABLE_FIELDS_CONFIG_KEY]: Record<string, string[]>
}

export default class TranslationModuleService
  extends MedusaService<{
    Locale: {
      dto: TranslationTypes.LocaleDTO
    }
    Translation: {
      dto: TranslationTypes.TranslationDTO
    }
  }>({
    Locale,
    Translation,
  })
  implements ITranslationModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected translationService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Translation
  >
  protected localeService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Locale
  >

  private readonly translatableFieldsConfig_: Record<string, string[]>

  constructor({
    baseRepository,
    translationService,
    localeService,
    translatableFieldsConfig,
  }: InjectedDependencies) {
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.translationService_ = translationService
    this.localeService_ = localeService
    this.translatableFieldsConfig_ = translatableFieldsConfig
  }

  static prepareFilters(
    filters: FilterableTranslationProps
  ): FilterableTranslationProps {
    let { q, ...restFilters } = filters

    if (q) {
      restFilters = {
        ...restFilters,
        [raw(`translations::text ILIKE ?`, [`%${q}%`])]: [],
      }
    }

    return restFilters
  }

  @InjectManager()
  // @ts-expect-error
  async listTranslations(
    filters: FilterableTranslationProps = {},
    config: FindConfig<TranslationTypes.TranslationDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.TranslationDTO[]> {
    const preparedFilters = TranslationModuleService.prepareFilters(filters)

    const results = await this.translationService_.list(
      preparedFilters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(results)
  }

  @InjectManager()
  // @ts-expect-error
  async listAndCountTranslations(
    filters: FilterableTranslationProps = {},
    config: FindConfig<TranslationTypes.TranslationDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TranslationTypes.TranslationDTO[], number]> {
    const preparedFilters = TranslationModuleService.prepareFilters(filters)

    const [results, count] = await this.translationService_.listAndCount(
      preparedFilters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<TranslationTypes.TranslationDTO[]>(
        results
      ),
      count,
    ]
  }

  // @ts-expect-error
  createLocales(
    data: TranslationTypes.CreateLocaleDTO[],
    sharedContext?: Context
  ): Promise<TranslationTypes.LocaleDTO[]>
  // @ts-expect-error
  createLocales(
    data: TranslationTypes.CreateLocaleDTO,
    sharedContext?: Context
  ): Promise<TranslationTypes.LocaleDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createLocales(
    data: TranslationTypes.CreateLocaleDTO | TranslationTypes.CreateLocaleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.LocaleDTO | TranslationTypes.LocaleDTO[]> {
    const dataArray = Array.isArray(data) ? data : [data]
    const normalizedData = dataArray.map((locale) => ({
      ...locale,
      code: normalizeLocale(locale.code),
    }))

    const createdLocales = await this.localeService_.create(
      normalizedData,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<LocaleDTO[]>(
      createdLocales
    )
    return Array.isArray(data) ? serialized : serialized[0]
  }

  // @ts-expect-error
  createTranslations(
    data: CreateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO>

  // @ts-expect-error
  createTranslations(
    data: CreateTranslationDTO[],
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createTranslations(
    data: CreateTranslationDTO | CreateTranslationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    TranslationTypes.TranslationDTO | TranslationTypes.TranslationDTO[]
  > {
    const dataArray = Array.isArray(data) ? data : [data]
    const normalizedData = dataArray.map((translation) => ({
      ...translation,
      locale_code: normalizeLocale(translation.locale_code),
      translated_field_count: computeTranslatedFieldCount(
        translation.translations as Record<string, unknown>,
        this.translatableFieldsConfig_[translation.reference]
      ),
    }))

    const createdTranslations = await this.translationService_.create(
      normalizedData,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(createdTranslations)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  // @ts-expect-error
  updateTranslations(
    data: TranslationTypes.UpdateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO>
  // @ts-expect-error
  updateTranslations(
    data: TranslationTypes.UpdateTranslationDTO[],
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateTranslations(
    data:
      | TranslationTypes.UpdateTranslationDTO
      | TranslationTypes.UpdateTranslationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    TranslationTypes.TranslationDTO | TranslationTypes.TranslationDTO[]
  > {
    const dataArray = Array.isArray(data) ? data : [data]

    const updatesWithTranslations = dataArray.filter((d) => d.translations)

    if (updatesWithTranslations.length) {
      const idsNeedingReference = updatesWithTranslations
        .filter((d) => !d.reference)
        .map((d) => d.id)

      let referenceMap: Record<string, string> = {}

      if (idsNeedingReference.length) {
        const existingTranslations = await this.translationService_.list(
          { id: idsNeedingReference },
          { select: ["id", "reference"] },
          sharedContext
        )
        referenceMap = Object.fromEntries(
          existingTranslations.map((t) => [t.id, t.reference])
        )
      }

      for (const update of dataArray) {
        if (update.translations) {
          const reference = update.reference || referenceMap[update.id]
          ;(
            update as TranslationTypes.UpdateTranslationDTO & {
              translated_field_count: number
            }
          ).translated_field_count = computeTranslatedFieldCount(
            update.translations as Record<string, unknown>,
            this.translatableFieldsConfig_[reference] || []
          )
        }
      }
    }

    const updatedTranslations = await this.translationService_.update(
      dataArray,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(updatedTranslations)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  getTranslatableFields(entityType?: string): Record<string, string[]> {
    if (entityType) {
      return { [entityType]: this.translatableFieldsConfig_[entityType] }
    }
    return this.translatableFieldsConfig_
  }

  @InjectManager()
  async getStatistics(
    input: TranslationTypes.TranslationStatisticsInput,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.TranslationStatisticsOutput> {
    const { locales, entities } = input

    if (!locales || !locales.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "At least one locale must be provided"
      )
    }

    if (!entities || !Object.keys(entities).length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "At least one entity type must be provided"
      )
    }

    const normalizedLocales = locales.map(normalizeLocale)

    const manager = (sharedContext.transactionManager ??
      sharedContext.manager) as SqlEntityManager
    const knex = manager.getKnex()

    const result: TranslationTypes.TranslationStatisticsOutput = {}
    const entityTypes: string[] = []

    for (const entityType of Object.keys(entities)) {
      const translatableFields = this.translatableFieldsConfig_[entityType]

      if (!translatableFields || translatableFields.length === 0) {
        result[entityType] = {
          expected: 0,
          translated: 0,
          missing: 0,
          by_locale: Object.fromEntries(
            normalizedLocales.map((locale) => [
              locale,
              { expected: 0, translated: 0, missing: 0 },
            ])
          ),
        }
      } else {
        entityTypes.push(entityType)
      }
    }

    if (!entityTypes.length) {
      return result
    }

    const { rows } = await knex.raw(
      `
      SELECT
        reference,
        locale_code,
        COALESCE(SUM(translated_field_count), 0)::int AS translated_field_count
      FROM translation
      WHERE reference = ANY(?)
        AND locale_code = ANY(?)
        AND deleted_at IS NULL
      GROUP BY reference, locale_code
      `,
      [entityTypes, normalizedLocales]
    )

    for (const entityType of entityTypes) {
      const translatableFields = this.translatableFieldsConfig_[entityType]
      const fieldsPerEntity = translatableFields.length
      const entityCount = entities[entityType].count
      const expectedPerLocale = entityCount * fieldsPerEntity

      result[entityType] = {
        expected: expectedPerLocale * normalizedLocales.length,
        translated: 0,
        missing: expectedPerLocale * normalizedLocales.length,
        by_locale: Object.fromEntries(
          normalizedLocales.map((locale) => [
            locale,
            {
              expected: expectedPerLocale,
              translated: 0,
              missing: expectedPerLocale,
            },
          ])
        ),
      }
    }

    for (const row of rows) {
      const entityType = row.reference
      const localeCode = row.locale_code
      const translatedCount = parseInt(row.translated_field_count, 10) || 0

      result[entityType].by_locale[localeCode].translated = translatedCount
      result[entityType].by_locale[localeCode].missing =
        result[entityType].by_locale[localeCode].expected - translatedCount
      result[entityType].translated += translatedCount
    }

    for (const entityType of entityTypes) {
      result[entityType].missing =
        result[entityType].expected - result[entityType].translated
    }

    return result
  }
}
