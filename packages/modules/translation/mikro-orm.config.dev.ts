import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import Locale from "./src/models/locale"
import Translation from "./src/models/translation"

export default defineMikroOrmCliConfig("translation", {
  entities: [Locale, Translation],
})
