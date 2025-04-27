import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { HttpTypes } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let region: HttpTypes.AdminRegion
    let salesChannel: HttpTypes.AdminSalesChannel
    let stockLocation: HttpTypes.AdminStockLocation
    let testDraftOrder: HttpTypes.AdminDraftOrder
    let shippingOption: HttpTypes.AdminShippingOption

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      region = (
        await api.post(
          `/admin/regions`,
          {
            name: "USA",
            currency_code: "usd",
            countries: ["US"],
          },
          adminHeaders
        )
      ).data.region

      salesChannel = (
        await api.post("/admin/sales-channels", { name: "test" }, adminHeaders)
      ).data.sales_channel

      stockLocation = (
        await api.post(
          `/admin/stock-locations`,
          { name: "test location" },
          adminHeaders
        )
      ).data.stock_location

      const shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "test shipping profile", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      const fulfillmentSets = (
        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
          {
            name: `Test-${shippingProfile.id}`,
            type: "test-type",
          },
          adminHeaders
        )
      ).data.stock_location.fulfillment_sets

      const fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
          {
            name: `Test-${shippingProfile.id}`,
            geo_zones: [{ type: "country", country_code: "us" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
        { add: ["manual_test-provider"] },
        adminHeaders
      )

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )

      shippingOption = (
        await api.post(
          `/admin/shipping-options`,
          {
            name: `Test shipping option ${fulfillmentSet.id}`,
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 1000 }],
            rules: [],
          },
          adminHeaders
        )
      ).data.shipping_option

      testDraftOrder = (
        await api.post(
          "/admin/draft-orders",
          {
            email: "test@test.com",
            region_id: region.id,
            sales_channel_id: salesChannel.id,
          },
          adminHeaders
        )
      ).data.draft_order
    })

    describe("GET /draft-orders", () => {
      it("should get a list of draft orders", async () => {
        const response = await api.get("/admin/draft-orders", adminHeaders)

        expect(response.status).toBe(200)
        expect(response.data.draft_orders).toBeDefined()
        expect(response.data.draft_orders.length).toBe(1)
        expect(response.data.draft_orders).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              email: "test@test.com",
            }),
          ])
        )
      })
    })

    describe("POST /draft-orders", () => {
      it("should create a draft order", async () => {
        const response = await api.post(
          "/admin/draft-orders",
          {
            email: "test2@test.com",
            region_id: region.id,
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order.email).toBe("test2@test.com")
        expect(response.data.draft_order.region_id).toBe(region.id)
      })
    })

    describe("GET /draft-orders/:id", () => {
      it("should get a draft order", async () => {
        const response = await api.get(
          `/admin/draft-orders/${testDraftOrder.id}`,
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order.email).toBe("test@test.com")
        expect(response.data.draft_order.region_id).toBe(region.id)
      })
    })

    describe("POST /draft-orders/:id", () => {
      it("should update a draft order", async () => {
        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}`,
          {
            email: "test_new@test.com",
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order.email).toBe("test_new@test.com")
      })
    })

    describe("POST /draft-orders/:id/convert-to-order", () => {
      it("should convert a draft order to an order", async () => {
        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/convert-to-order`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order.status).toBe("pending")
      })
    })

    describe("POST /draft-orders/:id/edit/items/:item_id", () => {
      let product

      beforeEach(async () => {
        const inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItem.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Shirt",
              options: [{ title: "size", values: ["large", "small"] }],
              variants: [
                {
                  title: "L shirt",
                  options: { size: "large" },
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 10,
                    },
                  ],
                },
                {
                  title: "S shirt",
                  options: { size: "small" },
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 10,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )
        ).data.product
      })

      it("should create reservations for added items", async () => {
        // 1. Create first edit and add items to it
        let edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
          },
          adminHeaders
        )

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        // Create second edit and add items to it
        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [{ variant_id: product.variants[1].id, quantity: 2 }],
          },
          adminHeaders
        )

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        const reservations = (
          await api.get(`/admin/reservations`, adminHeaders)
        ).data.reservations

        const lineItem1Id = edit.items.find(
          (item) => item.variant_id === product.variants[0].id
        )?.id

        const lineItem2Id = edit.items.find(
          (item) => item.variant_id === product.variants[1].id
        )?.id

        // second edit didn't override the reservations for the first edit
        expect(reservations.length).toBe(2)
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: lineItem1Id,
              quantity: 1,
            }),
            expect.objectContaining({
              line_item_id: lineItem2Id,
              quantity: 2,
            }),
          ])
        )
      })
    })

    describe("DELETE /draft-orders/:id/shipping-options/methods/:method_id", () => {
      let product
      let edit

      beforeEach(async () => {
        const inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItem.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Shirt",
              options: [{ title: "size", values: ["large", "small"] }],
              variants: [
                {
                  title: "L shirt",
                  options: { size: "large" },
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 10,
                    },
                  ],
                },
                {
                  title: "S shirt",
                  options: { size: "small" },
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 10,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
          },
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/shipping-methods`,
          {
            shipping_option_id: shippingOption.id,
          },
          adminHeaders
        )

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview
      })

      it("should delete a shipping method from the draft order", async () => {
        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        const response = await api.delete(
          `/admin/draft-orders/${testDraftOrder.id}/edit/shipping-methods/method/${edit.shipping_methods[0].id}`,
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order_preview.shipping_methods.length).toBe(
          0
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
          {},
          adminHeaders
        )

        const order = (
          await api.get(
            `/admin/draft-orders/${testDraftOrder.id}`,
            adminHeaders
          )
        ).data.draft_order

        expect(order.shipping_methods.length).toBe(0)
      })
    })
  },
})
