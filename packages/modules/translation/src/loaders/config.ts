import {
  LoaderOptions,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { TRANSLATABLE_FIELDS_CONFIG_KEY } from "@utils/constants"
import { asValue } from "awilix"
import { translatableFieldsConfig } from "../utils/translatable-fields"
import Settings from "@models/settings"
import type { TranslationModuleOptions } from "../types"

export default async ({
  container,
  options,
}: LoaderOptions<TranslationModuleOptions>): Promise<void> => {
  const logger =
    container.resolve<Logger>(ContainerRegistrationKeys.LOGGER) ?? console
  const settingsService: ModulesSdkTypes.IMedusaInternalService<
    typeof Settings
  > = container.resolve("translationSettingsService")

  const mergedConfig: Record<string, string[]> = translatableFieldsConfig

  const userProvidedFields = options?.entities ?? []
  for (const field of userProvidedFields) {
    mergedConfig[field.type] ??= []
    mergedConfig[field.type] = Array.from(
      new Set([...(mergedConfig[field.type] ?? []), ...field.fields])
    )
  }

  try {
    const existingSettings = await settingsService.list(
      {},
      { select: ["id", "entity_type"] }
    )
    const existingByEntityType = new Map(
      existingSettings.map((s) => [s.entity_type, s.id])
    )

    const settingsToUpsert = Object.entries(mergedConfig).map(
      ([entityType, fields]) => {
        const existingId = existingByEntityType.get(entityType)
        return existingId
          ? { id: existingId, entity_type: entityType, fields }
          : { entity_type: entityType, fields }
      }
    )

    const resp = await settingsService.upsert(settingsToUpsert)
    logger.debug(`Loaded ${resp.length} translation settings`)
  } catch (error) {
    logger.warn(
      `Failed to load translation settings, skipping loader. Original error: ${error.message}`
    )
  }

  container.register(TRANSLATABLE_FIELDS_CONFIG_KEY, asValue(mergedConfig))
}
