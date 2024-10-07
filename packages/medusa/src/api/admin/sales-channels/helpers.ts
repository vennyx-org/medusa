import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"

export const refetchSalesChannel = async (
  salesChannelId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channel",
    variables: {
      filters: { id: salesChannelId },
    },
    fields: fields,
  })

  const salesChannels = await remoteQuery(queryObject)
  return salesChannels[0]
}
