import { model } from "@medusajs/framework/utils"

const Translation = model
  .define("translation", {
    id: model.id({ prefix: "trans" }).primaryKey(),
    reference_id: model.text().searchable(),
    reference: model.text().searchable(), // e.g., "product", "product_variant", "product_category"
    locale_code: model.text().searchable(), // BCP 47 language tag, e.g., "en-US", "da-DK"
    translations: model.json(), // JSON object containing translated fields, e.g., { "title": "...", "description": "..." }
  })
  .indexes([
    {
      on: ["reference_id", "locale_code"],
      unique: true,
    },
    {
      on: ["reference_id", "reference", "locale_code"],
    },
    {
      on: ["reference", "locale_code"],
    },
    {
      on: ["reference_id", "reference"],
    },
    {
      on: ["locale_code"],
    },
  ])

export default Translation
