import { LoaderOptions } from "@medusajs/framework/types"
import { TRANSLATABLE_FIELDS_CONFIG_KEY } from "@utils/constants"
import { asValue } from "awilix"
import { translatableFieldsConfig } from "../utils/translatable-fields"

export default async ({ container }: LoaderOptions): Promise<void> => {
  container.register(
    TRANSLATABLE_FIELDS_CONFIG_KEY,
    asValue(translatableFieldsConfig)
  )
}
