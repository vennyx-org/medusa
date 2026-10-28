import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ClaimReason,
  ClaimType,
  Modules,
  ProductStatus,
  RuleOperator,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order
    let customer
    let returnShippingOption
    let outboundShippingOption
    let shippingProfile
    let fulfillmentSet
    let inventoryItem
    let location
    let salesChannel
    let region
    let product
    let productExtra

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      customer = (
        await api.post(
          "/admin/customers",
          {
            first_name: "joe",
            email: "joe@admin.com",
          },
          adminHeaders
        )
      ).data.customer

      // Set up supported locales in the store
      const storeModule = container.resolve(Modules.STORE)
      const [defaultStore] = await storeModule.listStores(
        {},
        { select: ["id"], take: 1 }
      )
      await storeModule.updateStores(defaultStore.id, {
        supported_locales: [
          { locale_code: "en-US" },
          { locale_code: "fr-FR" },
          { locale_code: "de-DE" },
        ],
      })

      salesChannel = (
        await api.post(
          "/admin/sales-channels",
          { name: "Webshop", description: "channel" },
          adminHeaders
        )
      ).data.sales_channel

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      region = (
        await api.post(
          "/admin/regions",
          {
            name: "Test Region",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region

      location = (
        await api.post(
          `/admin/stock-locations`,
          { name: "Test location" },
          adminHeaders
        )
      ).data.stock_location

      inventoryItem = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "test-variant" },
          adminHeaders
        )
      ).data.inventory_item

      await api.post(
        `/admin/inventory-items/${inventoryItem.id}/location-levels`,
        { location_id: location.id, stocked_quantity: 10 },
        adminHeaders
      )

      await api.post(
        `/admin/stock-locations/${location.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            status: ProductStatus.PUBLISHED,
            options: [{ title: "size", values: ["large", "small"] }],
            shipping_profile_id: shippingProfile.id,
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
                options: { size: "large" },
                inventory_items: [
                  {
                    inventory_item_id: inventoryItem.id,
                    required_quantity: 1,
                  },
                ],
                prices: [{ currency_code: "usd", amount: 25 }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      productExtra = (
        await api.post(
          "/admin/products",
          {
            title: "Extra product",
            status: ProductStatus.PUBLISHED,
            options: [{ title: "size", values: ["large", "small"] }],
            shipping_profile_id: shippingProfile.id,
            variants: [
              {
                title: "Extra variant",
                sku: "extra-variant",
                options: { size: "large" },
                manage_inventory: false,
                prices: [{ currency_code: "usd", amount: 50 }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      location = (
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
          { name: "Test", type: "test-type" },
          adminHeaders
        )
      ).data.stock_location

      fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${location.fulfillment_sets[0].id}/service-zones`,
          {
            name: "Test",
            geo_zones: [{ type: "country", country_code: "us" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      await api.post(
        `/admin/stock-locations/${location.id}/fulfillment-providers`,
        { add: ["manual_test-provider"] },
        adminHeaders
      )

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          {
            name: "Return shipping",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 1500 }],
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "is_return",
                value: "true",
              },
            ],
          },
          adminHeaders
        )
      ).data.shipping_option

      outboundShippingOption = (
        await api.post(
          "/admin/shipping-options",
          {
            name: "Outbound shipping",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 0 }],
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "is_return",
                value: "false",
              },
            ],
          },
          adminHeaders
        )
      ).data.shipping_option

      // Create translations for shipping options
      await api.post(
        "/admin/translations/batch",
        {
          create: [
            {
              reference_id: returnShippingOption.id,
              reference: "shipping_option",
              locale_code: "fr-FR",
              translations: { name: "Expédition de retour" },
            },
            {
              reference_id: returnShippingOption.id,
              reference: "shipping_option",
              locale_code: "de-DE",
              translations: { name: "Rückversand" },
            },
            {
              reference_id: outboundShippingOption.id,
              reference: "shipping_option",
              locale_code: "fr-FR",
              translations: { name: "Expédition sortante" },
            },
            {
              reference_id: outboundShippingOption.id,
              reference: "shipping_option",
              locale_code: "de-DE",
              translations: { name: "Ausgehende Versand" },
            },
          ],
        },
        adminHeaders
      )
    })

    const createOrderWithLocale = async (locale?: string) => {
      const container = getContainer()
      const orderModule = container.resolve(Modules.ORDER)
      const inventoryModule = container.resolve(Modules.INVENTORY)

      const createdOrder = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar.com",
        locale,
        items: [
          {
            title: "Custom Item",
            variant_id: product.variants[0].id,
            quantity: 2,
            unit_price: 25,
          },
        ],
        sales_channel_id: salesChannel.id,
        shipping_address: {
          customer_id: customer.id,
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          customer_id: customer.id,
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
        },
        shipping_methods: [
          {
            name: "Test shipping method",
            amount: 10,
            data: {},
          },
        ],
        currency_code: "usd",
        customer_id: customer.id,
        transactions: [
          {
            amount: 60,
            currency_code: "usd",
          },
        ],
      })

      await inventoryModule.createReservationItems([
        {
          inventory_item_id: inventoryItem.id,
          location_id: location.id,
          quantity: 2,
          line_item_id: createdOrder.items![0].id,
        },
      ])

      // Fulfill the order
      await api.post(
        `/admin/orders/${createdOrder.id}/fulfillments`,
        {
          items: [
            {
              id: createdOrder.items![0].id,
              quantity: 2,
            },
          ],
        },
        adminHeaders
      )

      return createdOrder
    }

    describe("Claim shipping method translation", () => {
      describe("Inbound (return) shipping method", () => {
        it("should translate inbound shipping method name using French locale", async () => {
          order = await createOrderWithLocale("fr-FR")

          const claim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Test claim",
              },
              adminHeaders
            )
          ).data.claim

          await api.post(
            `/admin/claims/${claim.id}/inbound/items`,
            {
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                },
              ],
            },
            adminHeaders
          )

          const shippingMethodResult = await api.post(
            `/admin/claims/${claim.id}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          const inboundShippingMethod =
            shippingMethodResult.data.order_preview.shipping_methods.find(
              (sm: any) => sm.shipping_option_id === returnShippingOption.id
            )

          expect(inboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Expédition de retour",
              shipping_option_id: returnShippingOption.id,
            })
          )
        })

        it("should use original inbound shipping method name when order has no locale", async () => {
          order = await createOrderWithLocale()

          const claim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Test claim",
              },
              adminHeaders
            )
          ).data.claim

          await api.post(
            `/admin/claims/${claim.id}/inbound/items`,
            {
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                },
              ],
            },
            adminHeaders
          )

          const shippingMethodResult = await api.post(
            `/admin/claims/${claim.id}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          const inboundShippingMethod =
            shippingMethodResult.data.order_preview.shipping_methods.find(
              (sm: any) => sm.shipping_option_id === returnShippingOption.id
            )

          expect(inboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Return shipping",
              shipping_option_id: returnShippingOption.id,
            })
          )
        })
      })

      describe("Outbound shipping method", () => {
        it("should translate outbound shipping method", async () => {
          order = await createOrderWithLocale("fr-FR")

          const claim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Test claim",
              },
              adminHeaders
            )
          ).data.claim

          await api.post(
            `/admin/claims/${claim.id}/inbound/items`,
            {
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/outbound/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          const shippingMethodResult = await api.post(
            `/admin/claims/${claim.id}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          const outboundShippingMethod =
            shippingMethodResult.data.order_preview.shipping_methods.find(
              (sm: any) => sm.shipping_option_id === outboundShippingOption.id
            )

          expect(outboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Expédition sortante",
              shipping_option_id: outboundShippingOption.id,
            })
          )
        })

        it("should use original outbound shipping method name when order has no locale", async () => {
          order = await createOrderWithLocale()

          const claim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Test claim",
              },
              adminHeaders
            )
          ).data.claim

          await api.post(
            `/admin/claims/${claim.id}/inbound/items`,
            {
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/outbound/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          const shippingMethodResult = await api.post(
            `/admin/claims/${claim.id}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          const outboundShippingMethod =
            shippingMethodResult.data.order_preview.shipping_methods.find(
              (sm: any) => sm.shipping_option_id === outboundShippingOption.id
            )

          expect(outboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Outbound shipping",
              shipping_option_id: outboundShippingOption.id,
            })
          )
        })
      })

      describe("Both inbound and outbound shipping methods", () => {
        it("should translate both shipping methods", async () => {
          order = await createOrderWithLocale("fr-FR")

          const claim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Test claim",
              },
              adminHeaders
            )
          ).data.claim

          await api.post(
            `/admin/claims/${claim.id}/inbound/items`,
            {
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/outbound/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          const result = await api.post(
            `/admin/claims/${claim.id}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          const shippingMethods = result.data.order_preview.shipping_methods

          const inboundShippingMethod = shippingMethods.find(
            (sm: any) => sm.shipping_option_id === returnShippingOption.id
          )
          const outboundShippingMethod = shippingMethods.find(
            (sm: any) => sm.shipping_option_id === outboundShippingOption.id
          )

          expect(inboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Expédition de retour",
              shipping_option_id: returnShippingOption.id,
            })
          )

          expect(outboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Expédition sortante",
              shipping_option_id: outboundShippingOption.id,
            })
          )
        })

        it("should keep translations after confirming claim request", async () => {
          order = await createOrderWithLocale("fr-FR")

          const claim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Test claim",
              },
              adminHeaders
            )
          ).data.claim

          await api.post(
            `/admin/claims/${claim.id}/inbound/items`,
            {
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/outbound/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claim.id}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          await api.post(`/admin/claims/${claim.id}/request`, {}, adminHeaders)

          const orderResult = await api.get(
            `/admin/orders/${order.id}`,
            adminHeaders
          )

          const shippingMethods = orderResult.data.order.shipping_methods

          const outboundShippingMethod = shippingMethods.find(
            (sm: any) => sm.shipping_option_id === outboundShippingOption.id
          )

          expect(outboundShippingMethod).toEqual(
            expect.objectContaining({
              name: "Expédition sortante",
              shipping_option_id: outboundShippingOption.id,
            })
          )
        })
      })
    })
  },
})
