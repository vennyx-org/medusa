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
import {
  EmitEvents,
  InjectManager,
  MedusaContext,
  MedusaService,
  normalizeLocale,
} from "@medusajs/framework/utils"
import Locale from "@models/locale"
import Translation from "@models/translation"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  translationService: ModulesSdkTypes.IMedusaInternalService<typeof Translation>
  localeService: ModulesSdkTypes.IMedusaInternalService<typeof Locale>
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

  constructor({
    baseRepository,
    translationService,
    localeService,
  }: InjectedDependencies) {
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.translationService_ = translationService
    this.localeService_ = localeService
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
}
