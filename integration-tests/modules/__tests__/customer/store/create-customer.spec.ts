import { IAuthModuleService } from "@medusajs/types"

import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import jwt from "jsonwebtoken"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /store/customers", () => {
      let appContainer
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
      })

      // TODO: Reenable once the customer authentication is fixed, and use the HTTP endpoints instead.
      it.skip("should create a customer", async () => {
        const authService: IAuthModuleService = appContainer.resolve(
          Modules.AUTH
        )
        const { http } = appContainer.resolve(
          ContainerRegistrationKeys.CONFIG_MODULE
        ).projectConfig
        const authIdentity = await authService.createAuthIdentities({
          provider_identities: [
            {
              entity_id: "store_user",
              provider: "emailpass",
            },
          ],
        })

        const token = jwt.sign(authIdentity, http.jwtSecret)

        const response = await api.post(
          `/store/customers`,
          {
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              ...storeHeaders.headers,
            },
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          })
        )
      })
    })
  },
})
