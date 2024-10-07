import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"

export const refetchTaxRate = async (
  taxRateId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables: {
      filters: { id: taxRateId },
    },
    fields: fields,
  })

  const taxRates = await remoteQuery(queryObject)
  return taxRates[0]
}
