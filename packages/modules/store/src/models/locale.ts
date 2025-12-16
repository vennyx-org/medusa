import { model } from "@medusajs/framework/utils"
import Store from "./store"

const StoreLocale = model.define("StoreLocale", {
  id: model.id({ prefix: "stloc" }).primaryKey(),
  locale_code: model.text().searchable(),
  is_default: model.boolean().default(false),
  store: model
    .belongsTo(() => Store, {
      mappedBy: "supported_locales",
    })
    .nullable(),
})

export default StoreLocale
