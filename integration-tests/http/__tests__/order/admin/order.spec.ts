import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order, seeder, inventoryItemOverride3, productOverride3, shippingProfile

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile
    })

    describe("POST /orders/:id", () => {
      beforeEach(async () => {
        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
        })
        order = seeder.order

        order = (
          await api.get(`/admin/orders/${order.id}?fields=+email`, adminHeaders)
        ).data.order
      })

      it("should update shipping address on an order (by creating a new Address record)", async () => {
        const addressBefore = order.shipping_address

        const response = await api.post(
          `/admin/orders/${order.id}`,
          {
            shipping_address: {
              city: "New New York",
              address_1: "New Main street 123",
            },
          },
          adminHeaders
        )

        expect(response.data.order.shipping_address.id).not.toEqual(
          addressBefore.id
        ) // new addres created
        expect(response.data.order.shipping_address).toEqual(
          expect.objectContaining({
            customer_id: addressBefore.customer_id,
            company: addressBefore.company,
            first_name: addressBefore.first_name,
            last_name: addressBefore.last_name,
            address_1: "New Main street 123",
            address_2: addressBefore.address_2,
            city: "New New York",
            country_code: addressBefore.country_code,
            province: addressBefore.province,
            postal_code: addressBefore.postal_code,
            phone: addressBefore.phone,
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(1)
        expect(orderChangesResult[0]).toEqual(
          expect.objectContaining({
            version: 1,
            change_type: "update_order",
            status: "confirmed",
            created_by: expect.any(String),
            confirmed_by: expect.any(String),
            confirmed_at: expect.any(String),
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 1,
                applied: true,
                action: "UPDATE_ORDER_PROPERTIES",
                details: expect.objectContaining({
                  type: "shipping_address",
                  old: expect.objectContaining({
                    address_1: addressBefore.address_1,
                    city: addressBefore.city,
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                    company: addressBefore.company,
                    first_name: addressBefore.first_name,
                    last_name: addressBefore.last_name,
                    address_2: addressBefore.address_2,
                  }),
                  new: expect.objectContaining({
                    address_1: "New Main street 123",
                    city: "New New York",
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                    company: addressBefore.company,
                    first_name: addressBefore.first_name,
                    last_name: addressBefore.last_name,
                    address_2: addressBefore.address_2,
                  }),
                }),
              }),
            ]),
          })
        )
      })

      it("should fail to update shipping address if country code has been changed", async () => {
        const response = await api
          .post(
            `/admin/orders/${order.id}`,
            {
              shipping_address: {
                country_code: "HR",
              },
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.response.status).toBe(400)
        expect(response.response.data.message).toBe(
          "Country code cannot be changed"
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })

      it("should update billing address on an order (by creating a new Address record)", async () => {
        const addressBefore = order.billing_address

        const response = await api.post(
          `/admin/orders/${order.id}`,
          {
            billing_address: {
              city: "New New York",
              address_1: "New Main street 123",
            },
          },
          adminHeaders
        )

        expect(response.data.order.billing_address.id).not.toEqual(
          addressBefore.id
        ) // new addres created
        expect(response.data.order.billing_address).toEqual(
          expect.objectContaining({
            customer_id: addressBefore.customer_id,
            company: addressBefore.company,
            first_name: addressBefore.first_name,
            last_name: addressBefore.last_name,
            address_1: "New Main street 123",
            address_2: addressBefore.address_2,
            city: "New New York",
            country_code: addressBefore.country_code,
            province: addressBefore.province,
            postal_code: addressBefore.postal_code,
            phone: addressBefore.phone,
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(1)
        expect(orderChangesResult[0]).toEqual(
          expect.objectContaining({
            version: 1,
            change_type: "update_order",
            status: "confirmed",
            created_by: expect.any(String),
            confirmed_by: expect.any(String),
            confirmed_at: expect.any(String),
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 1,
                applied: true,
                action: "UPDATE_ORDER_PROPERTIES",
                details: expect.objectContaining({
                  type: "billing_address",
                  old: expect.objectContaining({
                    address_1: addressBefore.address_1,
                    city: addressBefore.city,
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                  }),
                  new: expect.objectContaining({
                    address_1: "New Main street 123",
                    city: "New New York",
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                  }),
                }),
              }),
            ]),
          })
        )
      })

      it("should fail to update billing address if country code has been changed", async () => {
        const response = await api
          .post(
            `/admin/orders/${order.id}`,
            {
              billing_address: {
                country_code: "HR",
              },
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.response.status).toBe(400)
        expect(response.response.data.message).toBe(
          "Country code cannot be changed"
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })

      it("should update orders email and shipping address and create 2 change records", async () => {
        const response = await api.post(
          `/admin/orders/${order.id}?fields=+email,*shipping_address`,
          {
            email: "new-email@example.com",
            shipping_address: {
              address_1: "New Main street 123",
            },
          },
          adminHeaders
        )

        expect(response.data.order.email).toBe("new-email@example.com")
        expect(response.data.order.shipping_address.id).not.toEqual(
          order.shipping_address.id
        )
        expect(response.data.order.shipping_address).toEqual(
          expect.objectContaining({
            address_1: "New Main street 123",
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(2)
        expect(orderChangesResult).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              version: 1,
              change_type: "update_order",
              status: "confirmed",
              confirmed_at: expect.any(String),
              created_by: expect.any(String),
              confirmed_by: expect.any(String),
              actions: expect.arrayContaining([
                expect.objectContaining({
                  version: 1,
                  applied: true,
                  action: "UPDATE_ORDER_PROPERTIES",
                  details: expect.objectContaining({
                    type: "shipping_address",
                    old: expect.objectContaining({
                      address_1: order.shipping_address.address_1,
                      city: order.shipping_address.city,
                    }),
                    new: expect.objectContaining({
                      address_1: "New Main street 123",
                    }),
                  }),
                }),
              ]),
            }),
            expect.objectContaining({
              version: 1,
              change_type: "update_order",
              status: "confirmed",
              confirmed_at: expect.any(String),
              created_by: expect.any(String),
              confirmed_by: expect.any(String),
              actions: expect.arrayContaining([
                expect.objectContaining({
                  version: 1,
                  applied: true,
                  action: "UPDATE_ORDER_PROPERTIES",
                  details: expect.objectContaining({
                    type: "email",
                    old: order.email,
                    new: "new-email@example.com",
                  }),
                }),
              ]),
            }),
          ])
        )
      })

      it("should fail to update email if it is invalid", async () => {
        const response = await api
          .post(
            `/admin/orders/${order.id}`,
            {
              email: "invalid-email",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.response.status).toBe(400)
        expect(response.response.data.message).toBe("The email is not valid")

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })
    })

    describe("POST /orders/:id/cancel", () => {
      beforeEach(async () => {
        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          inventoryItemOverride,
          withoutShipping: true,
        })
        order = seeder.order

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should successfully cancel an order and its authorized but not captured payments", async () => {
        const response = await api.post(
          `/admin/orders/${order.id}/cancel`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            status: "canceled",

            summary: expect.objectContaining({
              current_order_total: 0,
              accounting_total: 0,
            }),

            payment_collections: [
              expect.objectContaining({
                status: "canceled",
                captured_amount: 0,
                refunded_amount: 0,
                amount: 106,
                payments: [
                  expect.objectContaining({
                    canceled_at: expect.any(String),
                    refunds: [],
                    captures: [],
                  }),
                ],
              }),
            ],
          })
        )
      })

      it("should successfully cancel an order with a captured payment", async () => {
        const payment = order.payment_collections[0].payments[0]

        const paymentResponse = await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        expect(paymentResponse.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 106,
              }),
            ],
            refunds: [],
            amount: 106,
          })
        )

        const response = await api.post(
          `/admin/orders/${order.id}/cancel`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            status: "canceled",

            summary: expect.objectContaining({
              current_order_total: 0,
              accounting_total: 0,
            }),

            payment_collections: [
              expect.objectContaining({
                status: "canceled",
                captured_amount: 106,
                refunded_amount: 106,
                amount: 106,
                payments: [
                  expect.objectContaining({
                    canceled_at: null,
                    refunds: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 106,
                        created_by: expect.any(String),
                      }),
                    ],
                    captures: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 106,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        )
      })

      it("should successfully cancel an order with a partially captured payment", async () => {
        const payment = order.payment_collections[0].payments[0]

        const paymentResponse = await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 50 },
          adminHeaders
        )

        expect(paymentResponse.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: null,
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 50,
              }),
            ],
            refunds: [],
            amount: 106,
          })
        )

        const response = await api
          .post(`/admin/orders/${order.id}/cancel`, {}, adminHeaders)
          .catch((e) => e)

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            status: "canceled",

            summary: expect.objectContaining({
              current_order_total: 0,
              accounting_total: 0,
            }),

            payment_collections: [
              expect.objectContaining({
                status: "canceled",
                captured_amount: 50,
                refunded_amount: 50,
                amount: 106,
                payments: [
                  expect.objectContaining({
                    refunds: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 50,
                        created_by: expect.any(String),
                      }),
                    ],
                    captures: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 50,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        )
      })
    })

    describe("POST /orders/:id/fulfillments", () => {
      let productOverride4WithOverrideShippingProfile,
        shippingProfileOverride,
        stockChannelOverride

      beforeEach(async () => {
        stockChannelOverride = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: true },
            adminHeaders
          )
        ).data.inventory_item

        const productOverride = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture`,
              shipping_profile_id: shippingProfile.id,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant",
                  sku: "w-inv-override-1",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const inventoryItemOverride2 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-2", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemOverride3 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-3", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        const inventoryItemOverride4RequiresShipping = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-4", requires_shipping: true },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride2.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride3.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride4RequiresShipping.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        const productOverride2 = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 2`,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 2",
                  sku: "w-inv-override-2",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride2.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        productOverride3 = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 3`,
              shipping_profile_id: shippingProfile.id,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 3",
                  sku: "test-variant-3",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride3.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "small",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        shippingProfileOverride = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: `test-${stockChannelOverride.id}`, type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        productOverride4WithOverrideShippingProfile = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 4`,
              shipping_profile_id: shippingProfileOverride.id,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 4",
                  sku: "test-variant-4",
                  inventory_items: [
                    {
                      inventory_item_id:
                        inventoryItemOverride4RequiresShipping.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "small",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          productOverride,
          additionalProducts: [
            { variant_id: productOverride2.variants[0].id, quantity: 1 },
            { variant_id: productOverride3.variants[0].id, quantity: 3 },
            {
              variant_id:
                productOverride4WithOverrideShippingProfile.variants[0].id,
              quantity: 1,
            },
          ],
          stockChannelOverride,
          inventoryItemOverride,
          shippingProfileOverride: [shippingProfile, shippingProfileOverride],
        })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should find the order querying it by number", async () => {
        const userEmail = "tony@stark-industries.com"

        const response = (
          await api.get(`/admin/orders/?q=non-existing`, adminHeaders)
        ).data

        expect(response.orders).toHaveLength(0)

        const response2 = (
          await api.get(`/admin/orders/?fields=+email&q=@stark`, adminHeaders)
        ).data

        expect(response2.orders).toHaveLength(1)
        expect(response2.orders[0].email).toEqual(userEmail)
      })

      it("should update stock levels correctly when creating partial fulfillment on an order", async () => {
        const orderItemId = order.items.find(
          (i) => i.variant_id === productOverride3.variants[0].id
        ).id

        let iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(10)
        expect(iitem.reserved_quantity).toBe(3)

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(9)
        expect(iitem.reserved_quantity).toBe(2)

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(8)
        expect(iitem.reserved_quantity).toBe(1)

        const {
          data: { order: fulfillableOrder },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=fulfillments.id`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder.fulfillments).toHaveLength(3)

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(7)
        expect(iitem.reserved_quantity).toBe(0)
      })

      it("should throw if trying to fulfillment more items than it is reserved", async () => {
        const orderItemId = order.items.find(
          (i) => i.variant_id === productOverride3.variants[0].id
        ).id

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id,
              location_id: seeder.stockLocation.id,
              items: [{ id: orderItemId, quantity: 5 }],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data.message).toBe(
          `Quantity to fulfill exceeds the reserved quantity for the item: ${orderItemId}`
        )
      })

      it("should throw if shipping profile of the product doesn't match the shipping profile of the shipping option", async () => {
        const orderItemId = order.items.find(
          (i) =>
            i.variant_id ===
            productOverride4WithOverrideShippingProfile.variants[0].id
        ).id

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id, // shipping option with the "regular" shipping profile
              location_id: stockChannelOverride.id,
              items: [{ id: orderItemId, quantity: 1 }],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data.message).toBe(
          `Shipping profile ${seeder.shippingProfile.id} does not match the shipping profile of the order item ${orderItemId}`
        )
      })

      it("should only create fulfillments grouped by shipping requirement", async () => {
        const i1 = order.items.find((i) => i.variant_sku === `w-inv-override-1`)
        const i2 = order.items.find((i) => i.variant_sku === `w-inv-override-2`)

        const {
          response: { data },
        } = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id,
              location_id: seeder.stockLocation.id,
              items: [
                {
                  id: i1.id,
                  quantity: 1,
                },
                {
                  id: i2.id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(data).toEqual({
          type: "invalid_data",
          message: `Fulfillment can only be created entirely with items with shipping or items without shipping. Split this request into 2 fulfillments.`,
        })

        const {
          data: { order: fulfillableOrder },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=+fulfillments.id,fulfillments.requires_shipping`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: i1.id, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder.fulfillments).toHaveLength(1)

        const {
          data: { order: fulfillableOrder2 },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=+fulfillments.id,fulfillments.requires_shipping`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: i2.id, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder2.fulfillments).toHaveLength(2)
      })
    })

    describe("POST /orders/:id/fulfillments/:id/cancel", () => {
      let inventoryItemDesk
      let inventoryItemLeg

      beforeEach(async () => {
        const container = getContainer()

        const publishableKey = await generatePublishableKey(container)

        const storeHeaders = generateStoreHeaders({
          publishableKey,
        })

        const region = (
          await api.post(
            "/admin/regions",
            { name: "Test region", currency_code: "usd" },
            adminHeaders
          )
        ).data.region

        const salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "first channel", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        const stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        inventoryItemDesk = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "table-desk" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemLeg = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "table-leg" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemDesk.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemLeg.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 40,
          },
          adminHeaders
        )

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: `test-${stockLocation.id}`, type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const product = (
          await api.post(
            "/admin/products",
            {
              title: `Wooden table`,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "color", values: ["green"] }],
              variants: [
                {
                  title: "Green table",
                  sku: "green-table",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemDesk.id,
                      required_quantity: 1,
                    },
                    {
                      inventory_item_id: inventoryItemLeg.id,
                      required_quantity: 4,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

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

        const shippingOption = (
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
              prices: [
                { currency_code: "usd", amount: 1000 },
                { region_id: region.id, amount: 1100 },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        const cart = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              email: "tony@stark-industries.com",
              region_id: region.id,
              shipping_address: {
                address_1: "test address 1",
                address_2: "test address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              billing_address: {
                address_1: "test billing address 1",
                address_2: "test billing address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              sales_channel_id: salesChannel.id,
              items: [{ quantity: 2, variant_id: product.variants[0].id }],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cart.id}/shipping-methods`,
          { option_id: shippingOption.id },
          storeHeaders
        )

        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            {
              cart_id: cart.id,
            },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        order = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data.order
      })

      it("should correctly manage reservations when canceling a fulfillment (with inventory kit)", async () => {
        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )

        // 1. create a partial fulfillment
        const fulOrder = (
          await api.post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )
        ).data.order

        // 2. two fulfillment items are created for a single (inventory kit) line item
        expect(fulOrder.fulfillments[0].items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        expect(fulOrder.items[0].detail.fulfilled_quantity).toEqual(1)

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        // 3. reservations need to be reduced by half since we fulfilled 1 item out of 2 in the order
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        const { data } = await api.post(
          `/admin/orders/${fulOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/cancel?fields=*fulfillments,*fulfillments.items`,
          {},
          adminHeaders
        )

        expect(data.order.fulfillments[0].canceled_at).toBeDefined()
        expect(data.order.items[0].detail.fulfilled_quantity).toEqual(0)

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        // 4. reservation qunatities are restored after partial fulfillment is canceled
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )

        // 5. create a fullfillment for the entier quantity
        const fulOrderFull = (
          await api.post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 2 }],
            },
            adminHeaders
          )
        ).data.order

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        // 6. no more reservations since the entier quantity is fulfilled
        expect(reservations).toEqual([])

        expect(
          fulOrderFull.fulfillments.find((f) => !f.canceled_at)!.items
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )

        expect(fulOrderFull.items[0].detail.fulfilled_quantity).toEqual(2)

        // 7. cancel the entire fulfillment once again
        await api.post(
          `/admin/orders/${fulOrderFull.id}/fulfillments/${
            fulOrderFull.fulfillments.find((f) => !f.canceled_at)!.id
          }/cancel?fields=*fulfillments,*fulfillments.items`,
          {},
          adminHeaders
        )

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        // 8. reservation need to be restored to the initiall quantities
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )
      })

      it("should throw an error if the quantity to fulfill exceeds the reserved quantity (inventory kit case)", async () => {
        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )

        // 1. create a partial fulfillment
        const fulOrder = (
          await api.post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )
        ).data.order

        // 2. two fulfillment items are created for a single (inventory kit) line item
        expect(fulOrder.fulfillments[0].items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        expect(fulOrder.items[0].detail.fulfilled_quantity).toEqual(1)

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        // 3. reservations need to be reduced by half since we fulfilled 1 item out of 2 in the order
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 2 }],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data).toEqual({
          type: "invalid_data",
          message: `Quantity to fulfill exceeds the reserved quantity for the item: ${order.items[0].id}`,
        })
      })
    })

    describe("POST /orders/:id/fulfillments/:id/mark-as-delivered", () => {
      beforeEach(async () => {
        seeder = await createOrderSeeder({ api, container: getContainer() })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should mark fulfillable item as delivered", async () => {
        let fulfillableItem = order.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: seeder.stockLocation.id,
            items: [
              {
                id: fulfillableItem.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items[0].detail).toEqual(
          expect.objectContaining({
            fulfilled_quantity: 1,
            delivered_quantity: 0,
          })
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments/${order.fulfillments[0].id}/mark-as-delivered`,
          {},
          adminHeaders
        )

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items[0].detail).toEqual(
          expect.objectContaining({
            fulfilled_quantity: 1,
            delivered_quantity: 1,
          })
        )

        const { response } = await api
          .post(
            `/admin/orders/${order.id}/fulfillments/${order.fulfillments[0].id}/mark-as-delivered`,
            {},
            adminHeaders
          )
          .catch((e) => e)

        expect(response.data).toEqual({
          type: "not_allowed",
          message: "Fulfillment has already been marked delivered",
        })
      })

      describe("with inventory kit items", () => {
        let inventoryItemDesk
        let inventoryItemLeg

        beforeEach(async () => {
          const container = getContainer()

          const publishableKey = await generatePublishableKey(container)

          const storeHeaders = generateStoreHeaders({
            publishableKey,
          })

          const region = (
            await api.post(
              "/admin/regions",
              { name: "Test region", currency_code: "usd" },
              adminHeaders
            )
          ).data.region

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "first channel", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          const stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          inventoryItemDesk = (
            await api.post(
              `/admin/inventory-items`,
              { sku: "table-desk" },
              adminHeaders
            )
          ).data.inventory_item

          inventoryItemLeg = (
            await api.post(
              `/admin/inventory-items`,
              { sku: "table-leg" },
              adminHeaders
            )
          ).data.inventory_item

          await api.post(
            `/admin/inventory-items/${inventoryItemDesk.id}/location-levels`,
            {
              location_id: stockLocation.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItemLeg.id}/location-levels`,
            {
              location_id: stockLocation.id,
              stocked_quantity: 40,
            },
            adminHeaders
          )

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const shippingProfile = (
            await api.post(
              `/admin/shipping-profiles`,
              { name: `test-${stockLocation.id}`, type: "default" },
              adminHeaders
            )
          ).data.shipping_profile

          const product = (
            await api.post(
              "/admin/products",
              {
                title: `Wooden table`,
                shipping_profile_id: shippingProfile.id,
                options: [{ title: "color", values: ["green"] }],
                variants: [
                  {
                    title: "Green table",
                    sku: "green-table",
                    inventory_items: [
                      {
                        inventory_item_id: inventoryItemDesk.id,
                        required_quantity: 1,
                      },
                      {
                        inventory_item_id: inventoryItemLeg.id,
                        required_quantity: 4,
                      },
                    ],
                    prices: [
                      {
                        currency_code: "usd",
                        amount: 100,
                      },
                    ],
                    options: {
                      color: "green",
                    },
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

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

          const shippingOption = (
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

          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                billing_address: {
                  address_1: "test billing address 1",
                  address_2: "test billing address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 2, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order
        })

        it("set correct quantity as delivered on the line item when marking fulfillment as delivered", async () => {
          let reservations = (
            await api.get(`/admin/reservations`, adminHeaders)
          ).data.reservations

          expect(reservations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                inventory_item_id: inventoryItemDesk.id,
                quantity: 2,
              }),
              expect.objectContaining({
                inventory_item_id: inventoryItemLeg.id,
                quantity: 8,
              }),
            ])
          )

          // 1. create a partial fulfillment
          const fulOrder = (
            await api.post(
              `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
              {
                items: [{ id: order.items[0].id, quantity: 1 }],
              },
              adminHeaders
            )
          ).data.order

          // 2. two fulfillment items are created for a single (inventory kit) line item
          expect(fulOrder.fulfillments[0].items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                inventory_item_id: inventoryItemDesk.id,
                quantity: 1,
              }),
              expect.objectContaining({
                inventory_item_id: inventoryItemLeg.id,
                quantity: 4,
              }),
            ])
          )

          expect(fulOrder.items[0].detail.fulfilled_quantity).toEqual(1)

          // 3. mark the fulfillment as shipped
          const shippedOrder = (
            await api.post(
              `/admin/orders/${fulOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/shipments`,
              {
                items: [
                  {
                    id: fulOrder.items[0].id,
                    quantity: 1,
                  },
                ],
              },
              adminHeaders
            )
          ).data.order

          expect(shippedOrder.items[0].detail.fulfilled_quantity).toEqual(1)
          expect(shippedOrder.items[0].detail.shipped_quantity).toEqual(1)

          // 4. mark the fulfillment as delivered
          const deliveredOrder = (
            await api.post(
              `/admin/orders/${fulOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/mark-as-delivered`,
              {},
              adminHeaders
            )
          ).data.order

          // 5. 1 line item was fulfilled so 1 line item is delivered
          expect(deliveredOrder.items[0].detail.fulfilled_quantity).toEqual(1)
          expect(deliveredOrder.items[0].detail.shipped_quantity).toEqual(1)
          expect(deliveredOrder.items[0].detail.delivered_quantity).toEqual(1)

          // 6. repeat the same steps for the rest of the line items

          // 7. create a partial fulfillment
          const fulOrder2 = (
            await api.post(
              `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
              {
                items: [{ id: order.items[0].id, quantity: 1 }],
              },
              adminHeaders
            )
          ).data.order

          expect(fulOrder2.items[0].detail.fulfilled_quantity).toEqual(2)

          const secondFulfillment = fulOrder2.fulfillments.find(
            (f) => !f.shipped_at
          )!

          // 8. mark the fulfillment as shipped
          const shippedOrder2 = (
            await api.post(
              `/admin/orders/${fulOrder2.id}/fulfillments/${secondFulfillment.id}/shipments`,
              {
                items: [
                  {
                    id: fulOrder2.items[0].id,
                    quantity: 1,
                  },
                ],
              },
              adminHeaders
            )
          ).data.order

          expect(shippedOrder2.items[0].detail.fulfilled_quantity).toEqual(2)
          expect(shippedOrder2.items[0].detail.shipped_quantity).toEqual(2)
          expect(shippedOrder2.items[0].detail.delivered_quantity).toEqual(1)

          // 9. mark the fulfillment as delivered
          const deliveredOrder2 = (
            await api.post(
              `/admin/orders/${fulOrder2.id}/fulfillments/${secondFulfillment.id}/mark-as-delivered`,
              {},
              adminHeaders
            )
          ).data.order

          // 10. both items are fulfilled, shipped and delivered
          expect(deliveredOrder2.items[0].detail.fulfilled_quantity).toEqual(2)
          expect(deliveredOrder2.items[0].detail.shipped_quantity).toEqual(2)
          expect(deliveredOrder2.items[0].detail.delivered_quantity).toEqual(2)
        })
      })
    })

    describe("POST /orders/:id/credit-lines", () => {
      beforeEach(async () => {
        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          inventoryItemOverride,
          withoutShipping: true,
        })
        order = seeder.order

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should successfully create credit lines", async () => {
        const error = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toBe(400)
        expect(error.response.data.message).toBe(
          "Can only create positive credit lines if the order has a positive pending difference"
        )

        const error2 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: 10000,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error2.response.status).toBe(400)
        expect(error2.response.data.message).toBe(
          "Cannot create more positive credit lines with amount more than the pending difference"
        )

        const response = await api.post(
          `/admin/orders/${order.id}/credit-lines`,
          {
            amount: 106,
            reference: "order",
            reference_id: order.id,
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            total: 0,
            subtotal: 100,
            summary: expect.objectContaining({
              current_order_total: 0,
              accounting_total: 0,
              pending_difference: 0,
            }),
          })
        )

        await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const item = order.items[0]

        let result = (
          await api.post(
            `/admin/order-edits/${order.id}/items/item/${item.id}`,
            { quantity: 0 },
            adminHeaders
          )
        ).data.order_preview

        result = (
          await api.post(
            `/admin/order-edits/${order.id}/request`,
            {},
            adminHeaders
          )
        ).data.order_preview

        result = (
          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )
        ).data.order_preview

        result = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        const errorResponse = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: 106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(errorResponse.response.status).toBe(400)
        expect(errorResponse.response.data.message).toBe(
          "Can only create negative credit lines if the order has a negative pending difference"
        )

        const error3 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -10000,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error3.response.status).toBe(400)
        expect(error3.response.data.message).toBe(
          "Cannot create more negative credit lines with amount more than the pending difference"
        )

        const response2 = await api.post(
          `/admin/orders/${order.id}/credit-lines`,
          {
            amount: -106,
            reference: "order",
            reference_id: order.id,
          },
          adminHeaders
        )

        expect(response2.data.order.summary.pending_difference).toEqual(0)

        const response3 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response3.response.status).toBe(400)
        expect(response3.response.data.message).toBe(
          "Can only create credit lines if the order has a positive or negative pending difference"
        )
      })
    })
  },
})
