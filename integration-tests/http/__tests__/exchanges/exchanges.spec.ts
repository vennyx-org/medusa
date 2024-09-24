import {
  ContainerRegistrationKeys,
  Modules,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../modules/__tests__/fixtures/tax"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order, order2
    let returnShippingOption
    let outboundShippingOption
    let shippingProfile
    let fulfillmentSet
    let returnReason
    let inventoryItem
    let inventoryItemExtra
    let location
    let productExtra
    const shippingProviderId = "manual_test-provider"

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const region = (
        await api.post(
          "/admin/regions",
          {
            name: "test-region",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region

      const customer = (
        await api.post(
          "/admin/customers",
          {
            first_name: "joe",
            email: "joe@admin.com",
          },
          adminHeaders
        )
      ).data.customer

      const salesChannel = (
        await api.post(
          "/admin/sales-channels",
          {
            name: "Test channel",
          },
          adminHeaders
        )
      ).data.sales_channel

      const product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
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

      productExtra = (
        await api.post(
          "/admin/products",
          {
            title: "Extra product",
            variants: [
              {
                title: "my variant",
                sku: "variant-sku",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 123456.1234657890123456789,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      returnReason = (
        await api.post(
          "/admin/return-reasons",
          {
            value: "return-reason-test",
            label: "Test return reason",
          },
          adminHeaders
        )
      ).data.return_reason

      const orderModule = container.resolve(Modules.ORDER)

      order = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar.com",
        items: [
          {
            title: "Custom Item 2",
            variant_id: product.variants[0].id,
            quantity: 2,
            unit_price: 25,
          },
        ],
        sales_channel_id: salesChannel.id,
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
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
            tax_lines: [
              {
                description: "shipping Tax 1",
                tax_rate_id: "tax_usa_shipping",
                code: "code",
                rate: 10,
              },
            ],
          },
        ],
        currency_code: "usd",
        customer_id: customer.id,
      })

      order2 = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar2.com",
        items: [
          {
            title: "Custom Iasdasd2",
            quantity: 1,
            unit_price: 20,
          },
        ],
        sales_channel_id: salesChannel.id,
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
        },
        currency_code: "usd",
        customer_id: customer.id,
      })

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          {
            name: "Test",
            type: "default",
          },
          adminHeaders
        )
      ).data.shipping_profile

      location = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "Test location",
          },
          adminHeaders
        )
      ).data.stock_location

      location = (
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
          {
            name: "Test",
            type: "test-type",
          },
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

      inventoryItem = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "inv-1234" },
          adminHeaders
        )
      ).data.inventory_item

      await api.post(
        `/admin/inventory-items/${inventoryItem.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 2,
        },
        adminHeaders
      )

      inventoryItemExtra = (
        await api.get(`/admin/inventory-items?sku=variant-sku`, adminHeaders)
      ).data.inventory_items[0]

      await api.post(
        `/admin/inventory-items/${inventoryItemExtra.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 4,
        },
        adminHeaders
      )

      const remoteLink = container.resolve(
        ContainerRegistrationKeys.REMOTE_LINK
      )

      await remoteLink.create([
        {
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_provider_id: shippingProviderId,
          },
        },
        {
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
          },
        },
        {
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: salesChannel.id,
          },
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
        },
        {
          [Modules.PRODUCT]: {
            variant_id: product.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItem.id,
          },
        },
        {
          [Modules.PRODUCT]: {
            variant_id: productExtra.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItemExtra.id,
          },
        },
      ])

      const shippingOptionPayload = {
        name: "Return shipping",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        provider_id: shippingProviderId,
        price_type: "flat",
        type: {
          label: "Test type",
          description: "Test description",
          code: "test-code",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
        ],
        rules: [
          {
            operator: RuleOperator.EQ,
            attribute: "is_return",
            value: "true",
          },
        ],
      }

      const outboundShippingOptionPayload = {
        name: "Oubound shipping",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        provider_id: shippingProviderId,
        price_type: "flat",
        type: {
          label: "Test type",
          description: "Test description",
          code: "test-code",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 20,
          },
        ],
        rules: [
          {
            operator: RuleOperator.EQ,
            attribute: "is_return",
            value: "false",
          },
          {
            operator: RuleOperator.EQ,
            attribute: "enabled_in_store",
            value: "true",
          },
        ],
      }
      outboundShippingOption = (
        await api.post(
          "/admin/shipping-options",
          outboundShippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      const item = order.items[0]

      await api.post(
        `/admin/orders/${order.id}/fulfillments`,
        {
          items: [
            {
              id: item.id,
              quantity: 2,
            },
          ],
        },
        adminHeaders
      )

      await api.post(
        `/admin/orders/${order2.id}/fulfillments`,
        {
          items: [
            {
              id: order2.items[0].id,
              quantity: 1,
            },
          ],
        },
        adminHeaders
      )

      await setupTaxStructure(container.resolve(Modules.TAX))
    })

    describe("Exchanges lifecycle", () => {
      it("Full flow with 2 orders", async () => {
        let result = await api.post(
          "/admin/exchanges",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        expect(result.data.exchange.created_by).toEqual(expect.any(String))

        const exchangeId = result.data.exchange.id

        let r2 = await api.post(
          "/admin/exchanges",
          {
            order_id: order2.id,
          },
          adminHeaders
        )

        const exchangeId2 = r2.data.exchange.id
        const item2 = order2.items[0]

        result = await api.post(
          `/admin/exchanges/${exchangeId2}/inbound/items`,
          {
            items: [
              {
                id: item2.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/exchanges/${exchangeId2}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        const { response } = await api
          .post(`/admin/exchanges/${exchangeId2}/request`, {}, adminHeaders)
          .catch((e) => e)

        expect(response.data).toEqual({
          type: "invalid_data",
          message:
            "Order exchange request should have at least 1 item inbound and 1 item outbound",
        })

        await api.post(
          `/admin/exchanges/${exchangeId2}/outbound/items`,
          {
            items: [
              {
                variant_id: productExtra.variants[0].id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/exchanges/${exchangeId2}/request`,
          {},
          adminHeaders
        )

        const item = order.items[0]

        result = await api.post(
          `/admin/exchanges/${exchangeId}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                reason_id: returnReason.id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/exchanges/${exchangeId}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        // updated the requested quantity
        const updateReturnItemActionId =
          result.data.order_preview.items[0].actions[0].id

        result = await api.post(
          `/admin/exchanges/${exchangeId}/inbound/items/${updateReturnItemActionId}`,
          {
            quantity: 1,
          },
          adminHeaders
        )

        // New Items
        result = await api.post(
          `/admin/exchanges/${exchangeId}/outbound/items`,
          {
            items: [
              {
                variant_id: productExtra.variants[0].id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        result = await api.post(
          `/admin/exchanges/${exchangeId}/request`,
          {},
          adminHeaders
        )

        result = (
          await api.get(
            `/admin/exchanges?fields=+metadata,*additional_items`,
            adminHeaders
          )
        ).data.exchanges

        expect(result).toHaveLength(2)
        expect(result[0].additional_items).toHaveLength(1)
        expect(result[0].canceled_at).toBeNull()

        await api.post(
          `/admin/exchanges/${exchangeId}/cancel`,
          {},
          adminHeaders
        )

        result = (
          await api.get(
            `/admin/exchanges?fields=*additional_items`,
            adminHeaders
          )
        ).data.exchanges
        expect(result[0].canceled_at).toBeDefined()
      })

      describe("with inbound and outbound items", () => {
        let exchange
        let orderPreview

        beforeEach(async () => {
          exchange = (
            await api.post(
              "/admin/exchanges",
              {
                order_id: order.id,
                description: "Test",
              },
              adminHeaders
            )
          ).data.exchange

          const item = order.items[0]

          await api.post(
            `/admin/exchanges/${exchange.id}/inbound/items`,
            {
              items: [
                {
                  id: item.id,
                  reason_id: returnReason.id,
                  quantity: 2,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/exchanges/${exchange.id}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/exchanges/${exchange.id}/outbound/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 2,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/exchanges/${exchange.id}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order
        })

        it("should remove outbound shipping method when outbound items are completely removed", async () => {
          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const exchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "ITEM_ADD")
          )

          const exchangeShippingMethods = orderPreview.shipping_methods.filter(
            (item) =>
              !!item.actions?.find(
                (action) =>
                  action.action === "SHIPPING_ADD" && !action.return_id
              )
          )

          expect(exchangeItems).toHaveLength(1)
          expect(exchangeShippingMethods).toHaveLength(1)

          await api.delete(
            `/admin/exchanges/${exchange.id}/outbound/items/${exchangeItems[0].actions[0].id}`,
            adminHeaders
          )

          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const updatedExchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "ITEM_ADD")
          )

          const updatedClaimShippingMethods =
            orderPreview.shipping_methods.filter(
              (item) =>
                !!item.actions?.find(
                  (action) =>
                    action.action === "SHIPPING_ADD" && !action.return_id
                )
            )

          expect(updatedExchangeItems).toHaveLength(0)
          expect(updatedClaimShippingMethods).toHaveLength(0)
        })

        it("should remove inbound shipping method when inbound items are completely removed", async () => {
          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const exchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "RETURN_ITEM")
          )

          const exchangeShippingMethods = orderPreview.shipping_methods.filter(
            (item) =>
              !!item.actions?.find(
                (action) =>
                  action.action === "SHIPPING_ADD" && !!action.return_id
              )
          )

          expect(exchangeItems).toHaveLength(1)
          expect(exchangeShippingMethods).toHaveLength(1)

          await api.delete(
            `/admin/exchanges/${exchange.id}/inbound/items/${exchangeItems[0].actions[0].id}`,
            adminHeaders
          )

          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const updatedExchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "RETURN_ITEM")
          )

          const updatedClaimShippingMethods =
            orderPreview.shipping_methods.filter(
              (item) =>
                !!item.actions?.find(
                  (action) =>
                    action.action === "SHIPPING_ADD" && !!action.return_id
                )
            )

          expect(updatedExchangeItems).toHaveLength(0)
          expect(updatedClaimShippingMethods).toHaveLength(0)
        })
      })
    })
  },
})
