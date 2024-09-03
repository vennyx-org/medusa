import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  AuthTypes,
  Context,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"
import {
  InjectManager,
  MedusaContext,
  MedusaError,
  MedusaService,
} from "@medusajs/utils"
import { AuthIdentity, ProviderIdentity } from "@models"
import jwt from "jsonwebtoken"
import { joinerConfig } from "../joiner-config"
import AuthProviderService from "./auth-provider"

// 15 minutes
const DEFAULT_RESET_PASSWORD_TOKEN_DURATION = 60 * 15

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authIdentityService: ModulesSdkTypes.IMedusaInternalService<any>
  providerIdentityService: ModulesSdkTypes.IMedusaInternalService<any>
  authProviderService: AuthProviderService
}
export default class AuthModuleService
  extends MedusaService<{
    AuthIdentity: { dto: AuthTypes.AuthIdentityDTO }
    ProviderIdentity: { dto: AuthTypes.ProviderIdentityDTO }
  }>({ AuthIdentity, ProviderIdentity })
  implements AuthTypes.IAuthModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected authIdentityService_: ModulesSdkTypes.IMedusaInternalService<AuthIdentity>
  protected providerIdentityService_: ModulesSdkTypes.IMedusaInternalService<ProviderIdentity>
  protected readonly authProviderService_: AuthProviderService

  constructor(
    {
      authIdentityService,
      providerIdentityService,
      authProviderService,
      baseRepository,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authIdentityService_ = authIdentityService
    this.authProviderService_ = authProviderService
    this.providerIdentityService_ = providerIdentityService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  // @ts-expect-error
  createAuthIdentities(
    data: AuthTypes.CreateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  createAuthIdentities(
    data: AuthTypes.CreateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  @InjectManager("baseRepository_")
  async createAuthIdentities(
    data: AuthTypes.CreateAuthIdentityDTO[] | AuthTypes.CreateAuthIdentityDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthIdentityDTO | AuthTypes.AuthIdentityDTO[]> {
    const authIdentities = await this.authIdentityService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO[]>(
      authIdentities,
      {
        populate: true,
      }
    )
  }

  // TODO: Update to follow convention
  // @ts-expect-error
  updateAuthIdentities(
    data: AuthTypes.UpdateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  updateAuthIdentities(
    data: AuthTypes.UpdateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  @InjectManager("baseRepository_")
  async updateAuthIdentities(
    data: AuthTypes.UpdateAuthIdentityDTO | AuthTypes.UpdateAuthIdentityDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthIdentityDTO | AuthTypes.AuthIdentityDTO[]> {
    const updatedUsers = await this.authIdentityService_.update(
      data,
      sharedContext
    )

    const serializedUsers = await this.baseRepository_.serialize<
      AuthTypes.AuthIdentityDTO[]
    >(updatedUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  async register(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.register(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // @ts-expect-error
  createProviderIdentities(
    data: AuthTypes.CreateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO[]>

  createProviderIdentities(
    data: AuthTypes.CreateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO>

  @InjectManager("baseRepository_")
  async createProviderIdentities(
    data:
      | AuthTypes.CreateProviderIdentityDTO[]
      | AuthTypes.CreateProviderIdentityDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.ProviderIdentityDTO | AuthTypes.ProviderIdentityDTO[]> {
    const providerIdentities = await this.providerIdentityService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      AuthTypes.ProviderIdentityDTO | AuthTypes.ProviderIdentityDTO[]
    >(providerIdentities)
  }

  // @ts-expect-error
  updateProviderIdentities(
    data: AuthTypes.UpdateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO[]>

  updateProviderIdentities(
    data: AuthTypes.UpdateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO>

  @InjectManager("baseRepository_")
  async updateProviderIdentities(
    data:
      | AuthTypes.UpdateProviderIdentityDTO
      | AuthTypes.UpdateProviderIdentityDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.ProviderIdentityDTO | AuthTypes.ProviderIdentityDTO[]> {
    const updatedProviders = await this.providerIdentityService_.update(
      data,
      sharedContext
    )

    const serializedProviders = await this.baseRepository_.serialize<
      AuthTypes.ProviderIdentityDTO[]
    >(updatedProviders)

    return Array.isArray(data) ? serializedProviders : serializedProviders[0]
  }

  async updateProviderData(
    provider: string,
    data: Record<string, unknown>
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.update(
        provider,
        data,
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async authenticate(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.authenticate(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async validateCallback(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.validateCallback(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async generateToken(
    payload: {
      entity_id: string
      provider: string
      actor_type: string
    } & Record<string, unknown>
  ): Promise<string> {
    if (!payload.entity_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Identifier `entity_id` is required to generate a token"
      )
    }

    const [providerIdentity] = await this.providerIdentityService_.list({
      entity_id: payload.entity_id,
      provider: payload.provider,
    })

    const tokenPayload = {
      provider_identity_id: providerIdentity.id,
      actor_type: payload.actor_type,
    }

    console.log("TOKEN PAYLOAD", tokenPayload)

    // TODO: Add config to auth module
    const expiry = DEFAULT_RESET_PASSWORD_TOKEN_DURATION
    const token = jwt.sign(tokenPayload, "secret", {
      expiresIn: expiry,
    })

    return token
  }

  getAuthIdentityProviderService(
    provider: string
  ): AuthIdentityProviderService {
    return {
      retrieve: async ({ entity_id }) => {
        const authIdentities = await this.authIdentityService_.list(
          {
            provider_identities: {
              entity_id,
              provider,
            },
          },
          {
            relations: ["provider_identities"],
          }
        )

        if (!authIdentities.length) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `AuthIdentity with entity_id "${entity_id}" not found`
          )
        }

        if (authIdentities.length > 1) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Multiple authIdentities found for entity_id "${entity_id}"`
          )
        }

        return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
          authIdentities[0]
        )
      },

      create: async (data: {
        entity_id: string
        provider_metadata?: Record<string, unknown>
        user_metadata?: Record<string, unknown>
      }) => {
        const normalizedRequest = {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider_metadata: data.provider_metadata,
              user_metadata: data.user_metadata,
              provider,
            },
          ],
        }

        const createdAuthIdentity = await this.authIdentityService_.create(
          normalizedRequest
        )

        return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
          createdAuthIdentity
        )
      },
      update: async (data: {
        id: string
        provider_metadata?: Record<string, unknown>
        user_metadata?: Record<string, unknown>
      }) => {
        const normalizedRequest = {
          id: data.id,
          provider_metadata: data.provider_metadata,
          user_metadata: data.user_metadata,
        }

        const updatedAuthIdentity = await this.updateProviderIdentities(
          normalizedRequest
        )

        return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
          updatedAuthIdentity
        )
      },
    }
  }
}
