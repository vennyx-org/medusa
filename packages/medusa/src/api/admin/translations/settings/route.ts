import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, ITranslationModuleService } from "@medusajs/framework/types"
import {
  defineFileConfig,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import TranslationFeatureFlag from "../../../../feature-flags/translation"
import { AdminTranslationSettingsParamsType } from "../validators"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    AdminTranslationSettingsParamsType
  >,
  res: MedusaResponse<HttpTypes.AdminTranslationSettingsResponse>
) => {
  const translationService = req.scope.resolve<ITranslationModuleService>(
    Modules.TRANSLATION
  )
  const translatableFields = await translationService.getTranslatableFields(
    req.validatedQuery.entity_type
  )

  res.json({
    translatable_fields: translatableFields,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})
