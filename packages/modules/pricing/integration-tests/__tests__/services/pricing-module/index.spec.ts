import { IPricingModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { PricingModuleService } from "@services"
import { moduleIntegrationTestRunner } from "medusa-test-utils"

moduleIntegrationTestRunner<IPricingModuleService>({
  moduleName: Modules.PRICING,
  testSuite: () => {
    describe("PricingModule Service - Calculate Price", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.PRICING, {
          service: PricingModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "priceSet",
          "priceList",
          "price",
          "pricePreference",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          priceSet: {
            id: {
              linkable: "price_set_id",
              entity: "PriceSet",
              primaryKey: "id",
              serviceName: "Pricing",
              field: "priceSet",
            },
          },
          priceList: {
            id: {
              linkable: "price_list_id",
              entity: "PriceList",
              primaryKey: "id",
              serviceName: "Pricing",
              field: "priceList",
            },
          },
          price: {
            id: {
              linkable: "price_id",
              entity: "Price",
              primaryKey: "id",
              serviceName: "Pricing",
              field: "price",
            },
          },
          pricePreference: {
            id: {
              linkable: "price_preference_id",
              entity: "PricePreference",
              primaryKey: "id",
              serviceName: "Pricing",
              field: "pricePreference",
            },
          },
        })
      })
    })
  },
})
