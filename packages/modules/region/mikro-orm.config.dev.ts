import { defineMikroOrmCliConfig, Modules } from "@medusajs/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig(Modules.REGION, {
  entities: Object.values(entities),
})
