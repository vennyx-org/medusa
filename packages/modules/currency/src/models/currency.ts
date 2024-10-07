import { model } from "@medusajs/framework/utils"

export default model.define("currency", {
  code: model.text().searchable().primaryKey(),
  symbol: model.text(),
  symbol_native: model.text(),
  name: model.text().searchable(),
  decimal_digits: model.number().default(0),
  rounding: model.bigNumber().default(0),
})
