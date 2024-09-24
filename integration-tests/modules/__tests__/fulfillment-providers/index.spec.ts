import { IFulfillmentModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer, api, dbConnection }) => {
    let service: IFulfillmentModuleService
    let container

    beforeAll(() => {
      container = getContainer()
      service = container.resolve(Modules.FULFILLMENT)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/fulfillment-providers", () => {
      it("should list all fulfillment providers", async () => {
        const response = await api.get(
          `/admin/fulfillment-providers`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.fulfillment_providers).toEqual([
          { id: "manual_test-provider", is_enabled: true },
        ])
      })
    })
  },
})
