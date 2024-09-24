import { objectFromStringPath } from "@medusajs/utils"

export function normalizeFieldsSelection(fields: string[]) {
  const normalizedFields = fields.map((field) => field.replace(/\.\*/g, ""))
  const fieldsObject = objectFromStringPath(normalizedFields)
  return fieldsObject
}
