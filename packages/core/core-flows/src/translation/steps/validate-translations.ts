import {
  ContainerRegistrationKeys,
  MedusaError,
  MedusaErrorTypes,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateTranslationDTO, UpdateTranslationDTO } from "@medusajs/types"

export const validateTranslationsStepId = "validate-translations"

export type ValidateTranslationsStepInput =
  | CreateTranslationDTO[]
  | CreateTranslationDTO
  | UpdateTranslationDTO[]
  | UpdateTranslationDTO

// TODO: Do we want to validate anything else here?
export const validateTranslationsStep = createStep(
  validateTranslationsStepId,
  async (data: ValidateTranslationsStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const {
      data: [store],
    } = await query.graph(
      {
        entity: "store",
        fields: ["id", "supported_locales.*"],
        pagination: {
          take: 1,
        },
      },
      {
        cache: { enable: true },
      }
    )

    const enabledLocales = (store.supported_locales ?? []).map(
      (locale) => locale.locale_code
    )
    const normalizedInput = Array.isArray(data) ? data : [data]

    const unsupportedLocales = normalizedInput
      .filter((translation) => Boolean(translation.locale_code))
      .map((translation) => translation.locale_code)
      .filter((locale) => !enabledLocales.includes(locale ?? ""))

    if (unsupportedLocales.length) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        `The following locales are not supported in the store: ${unsupportedLocales.join(
          ", "
        )}`
      )
    }
    return new StepResponse(void 0)
  }
)
