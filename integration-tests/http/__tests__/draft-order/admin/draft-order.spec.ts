import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { HttpTypes } from "@medusajs/types"
import { ModuleRegistrationName, ProductStatus } from "@medusajs/utils"
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
    let shippingOptionHeavy: HttpTypes.AdminShippingOption

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

      const shippingProfileHeavy = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "test shipping profile heavy", type: "heavy" },
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
            prices: [{ currency_code: "usd", amount: 5 }],
            rules: [],
          },
          adminHeaders
        )
      ).data.shipping_option

      shippingOptionHeavy = (
        await api.post(
          `/admin/shipping-options`,
          {
            name: `Test shipping option ${fulfillmentSet.id}`,
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfileHeavy.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 10 }],
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
            shipping_address: {
              address_1: "123 Main St",
              city: "Anytown",
              country_code: "US",
              postal_code: "12345",
              first_name: "John",
            },
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

    describe("DELETE /draft-orders/:id", () => {
      it("should delete a draft order", async () => {
        const response = await api.delete(
          `/admin/draft-orders/${testDraftOrder.id}`,
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data).toEqual(
          expect.objectContaining({
            id: testDraftOrder.id,
            object: "draft-order",
            deleted: true,
          })
        )
      })
    })

    describe("POST /draft-orders/:id/convert-to-order", () => {
      let product
      let inventoryItemLarge
      let inventoryItemMedium

      beforeEach(async () => {
        inventoryItemLarge = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-large" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemMedium = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-medium" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemLarge.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemMedium.id}/location-levels`,
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
              status: ProductStatus.PUBLISHED,
              options: [{ title: "size", values: ["large", "medium"] }],
              variants: [
                {
                  title: "L shirt",
                  options: { size: "large" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemLarge.id,
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
                  title: "M shirt",
                  options: { size: "medium" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemMedium.id,
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

      it("should convert a draft order to an order", async () => {
        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/convert-to-order`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order.status).toBe("pending")
      })

      it("should create reservations on draft order to order conversion", async () => {
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit`,
          {},
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "L shirt")
                  .id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "M shirt")
                  .id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations.length).toBe(0)

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
          {},
          adminHeaders
        )

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        expect(reservations.length).toBe(0)

        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/convert-to-order`,
          {},
          adminHeaders
        )

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemLarge.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemMedium.id,
              quantity: 1,
            }),
          ])
        )

        expect(response.status).toBe(200)
        expect(response.data.order.status).toBe("pending")
      })

      it("should convert a draft order with a custom item (without variant_id) to an order", async () => {
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit`,
          {},
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [
              {
                title: "Custom Item",
                quantity: 2,
                unit_price: 1500,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
          {},
          adminHeaders
        )

        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/convert-to-order`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order.status).toBe("pending")
      })

      it("should convert a draft order with both variant items and custom items to an order", async () => {
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit`,
          {},
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "L shirt")
                  .id,
                quantity: 1,
              },
              {
                title: "Custom Item",
                quantity: 1,
                unit_price: 2000,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
          {},
          adminHeaders
        )

        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations.length).toBe(0)

        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/convert-to-order`,
          {},
          adminHeaders
        )

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemLarge.id,
              quantity: 1,
            }),
          ])
        )

        expect(response.status).toBe(200)
        expect(response.data.order.status).toBe("pending")
      })
    })

    describe("POST /draft-orders/:id/edit/items/:item_id", () => {
      let product
      let inventoryItemLarge
      let inventoryItemMedium
      let inventoryItemSmall

      beforeEach(async () => {
        inventoryItemLarge = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-large" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemMedium = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-medium" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemSmall = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-small" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemLarge.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemMedium.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )
        await api.post(
          `/admin/inventory-items/${inventoryItemSmall.id}/location-levels`,
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
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: ["large", "medium", "small"] },
              ],
              variants: [
                {
                  title: "L shirt",
                  options: { size: "large" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemLarge.id,
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
                  title: "M shirt",
                  options: { size: "medium" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemMedium.id,
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
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemSmall.id,
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

      it("should not create reservations on draft order edit confirmation", async () => {
        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations.length).toBe(0)

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
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "L shirt")
                  .id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "M shirt")
                  .id,
                quantity: 1,
              },
            ],
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

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        expect(reservations.length).toBe(0)

        // Create second edit
        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        // Add item
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "S shirt")
                  .id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        // Remove item
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items/item/${
            edit.items.find((i) => i.subtitle === "M shirt").id
          }`,
          { quantity: 0 },
          adminHeaders
        )

        // Update item
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items/item/${
            edit.items.find((i) => i.subtitle === "L shirt").id
          }`,
          { quantity: 2 },
          adminHeaders
        )

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        expect(reservations.length).toBe(0)
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
              status: ProductStatus.PUBLISHED,
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

      it("should ensure that the shipping method is removed from the order and tax lines are updated with multiple shipping methods", async () => {
        /**
         * Add Heavy SO
         */

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/shipping-methods`,
          {
            shipping_option_id: shippingOptionHeavy.id,
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

        /**
         * Tax rate -> 2%
         *
         * One product -> 10$
         * Shipping method 1 -> 5$
         * Shipping method 2 -> 10$
         */

        expect(edit).toEqual(
          expect.objectContaining({
            total: 25.5,
            subtotal: 25,
            tax_total: 0.5,

            items: [
              expect.objectContaining({
                subtotal: 10,
                total: 10.2,
                tax_total: 0.2,
                tax_lines: [
                  expect.objectContaining({
                    rate: 2,
                  }),
                ],
              }),
            ],
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: shippingOption.id,
                amount: 5,
                subtotal: 5,
                total: 5.1,
                tax_total: 0.1,
              }),
              expect.objectContaining({
                shipping_option_id: shippingOptionHeavy.id,
                amount: 10,
                subtotal: 10,
                total: 10.2,
                tax_total: 0.2,
              }),
            ]),
          })
        )

        /**
         * Remove Heavy shipping method
         */

        edit = (
          await api.post(
            `/admin/draft-orders/${testDraftOrder.id}/edit`,
            {},
            adminHeaders
          )
        ).data.draft_order_preview

        const response = await api.delete(
          `/admin/draft-orders/${
            testDraftOrder.id
          }/edit/shipping-methods/method/${
            edit.shipping_methods.find(
              (sm) => sm.shipping_option_id === shippingOptionHeavy.id
            ).id
          }`,
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order_preview.shipping_methods.length).toBe(
          1
        )

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
          {},
          adminHeaders
        )

        const order = (
          await api.get(
            `/admin/draft-orders/${testDraftOrder.id}?fields=+total,+subtotal,+tax_total,+items.subtotal,+items.total,+items.tax_total,+shipping_methods.amount,+shipping_methods.subtotal,+shipping_methods.total,+shipping_methods.tax_total`,
            adminHeaders
          )
        ).data.draft_order

        expect(order).toEqual(
          expect.objectContaining({
            total: 15.3,
            subtotal: 15,
            tax_total: 0.3,

            items: [
              expect.objectContaining({
                subtotal: 10,
                total: 10.2,
                tax_total: 0.2,
                tax_lines: [
                  expect.objectContaining({
                    rate: 2,
                  }),
                ],
              }),
            ],
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: shippingOption.id,
                amount: 5,
                subtotal: 5,
                total: 5.1,
                tax_total: 0.1,
              }),
            ]),
          })
        )
      })
    })
  },
})
