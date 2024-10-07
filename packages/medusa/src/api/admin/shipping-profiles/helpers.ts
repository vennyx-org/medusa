import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"

export const refetchShippingProfile = async (
  shippingProfileId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_profile",
    variables: {
      filters: { id: shippingProfileId },
    },
    fields: fields,
  })

  const shippingProfiles = await remoteQuery(queryObject)
  return shippingProfiles[0]
}
