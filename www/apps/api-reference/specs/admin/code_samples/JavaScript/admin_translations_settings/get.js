import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.translation.settings({
  entity_type: "product"
})
.then(({ translatable_fields }) => {
  console.log(translatable_fields)
})