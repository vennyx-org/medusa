import { model } from "@medusajs/framework/utils"

const Locale = model
  .define("locale", {
    id: model.id({ prefix: "loc" }).primaryKey(),
    code: model.text().searchable(), // BCP 47 language tag, e.g., "en-US", "da-DK"
    name: model.text().searchable(), // Human-readable name, e.g., "English (US)", "Danish"
  })
  .indexes([
    {
      on: ["code"],
      unique: true,
    },
  ])

export default Locale
