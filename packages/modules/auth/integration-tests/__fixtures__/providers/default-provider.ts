import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
} from "@medusajs/framework/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@medusajs/framework/utils"

export class AuthServiceFixtures extends AbstractAuthModuleProvider {
  constructor() {
    super(
      {},
      { provider: "plaintextpass", displayName: "plaintextpass Fixture" }
    )
  }

  async authenticate(
    authenticationData: AuthenticationInput,
    service: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { email, password } = authenticationData.body ?? {}
    let authIdentity: AuthIdentityDTO | undefined
    try {
      authIdentity = await service.retrieve({
        entity_id: email,
      })

      // The provider has to be present, guaranteed by the retrieve filter above.
      const providerIdentity = authIdentity.provider_identities?.find(
        (pi) => pi.provider === this.provider
      )!

      if (providerIdentity.provider_metadata?.password === password) {
        return {
          success: true,
          authIdentity,
        }
      }
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await service.create({
          entity_id: email,
          provider_metadata: {
            password,
          },
        })

        return {
          success: true,
          authIdentity: createdAuthIdentity,
        }
      }

      return { success: false, error: error.message }
    }

    return {
      success: false,
      error: "Invalid email or password",
    }
  }
}

export const services = [AuthServiceFixtures]
