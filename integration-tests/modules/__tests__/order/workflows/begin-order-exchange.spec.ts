import {
  beginExchangeOrderWorkflow,
  createShippingOptionsWorkflow,
  orderExchangeAddNewItemWorkflow,
  orderExchangeRequestItemReturnWorkflow,
} from "@medusajs/core-flows"
import {
  FulfillmentWorkflow,
  IRegionModuleService,
  IStockLocationService,
  OrderWorkflow,
  ProductDTO,
  RegionDTO,
  SalesChannelDTO,
  StockLocationDTO,
  UserDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  RuleOperator,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(500000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const providerId = "manual_test-provider"

async function prepareDataFixtures({ container }) {
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const stockLocationModule: IStockLocationService = container.resolve(
    Modules.STOCK_LOCATION
  )
  const productModule = container.resolve(Modules.PRODUCT)
  const pricingModule = container.resolve(Modules.PRICING)
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const customerService = container.resolve(Modules.CUSTOMER)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const customer = await customerService.createCustomers({
    first_name: "joe",
    email: "joe@gmail.com",
  })

  const shippingProfile = await fulfillmentService.createShippingProfiles({
    name: "test",
    type: "default",
  })

  const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
    name: "Test fulfillment set",
    type: "manual_test",
  })

  const serviceZone = await fulfillmentService.createServiceZones({
    name: "Test service zone",
    fulfillment_set_id: fulfillmentSet.id,
    geo_zones: [
      {
        type: "country",
        country_code: "US",
      },
    ],
  })

  const regionService = container.resolve(
    Modules.REGION
  ) as IRegionModuleService

  const [region] = await regionService.createRegions([
    {
      name: "Test region",
      currency_code: "eur",
      countries: ["fr"],
    },
  ])

  const salesChannel = await salesChannelService.createSalesChannels({
    name: "Webshop",
  })

  const location: StockLocationDTO =
    await stockLocationModule.createStockLocations({
      name: "Warehouse",
      address: {
        address_1: "Test",
        city: "Test",
        country_code: "US",
        postal_code: "12345",
        phone: "12345",
      },
    })

  await remoteLink.create([
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: location.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_test-provider",
      },
    },
  ])

  const [product] = await productModule.createProducts([
    {
      title: "Test product",
      variants: [
        {
          title: "Test variant",
          sku: "test-variant",
        },
        {
          title: "another product variant",
          sku: "another-variant",
        },
      ],
    },
  ])

  const priceSets = await pricingModule.createPriceSets([
    {
      prices: [
        {
          amount: 45.987,
          region_id: region.id,
          currency_code: "eur",
        },
      ],
    },
  ])

  const inventoryItems = await inventoryModule.createInventoryItems([
    {
      sku: "inv-1234",
    },
    {
      sku: "another-inv-987",
    },
  ])

  await inventoryModule.createInventoryLevels([
    {
      inventory_item_id: inventoryItems[0].id,
      location_id: location.id,
      stocked_quantity: 2,
      reserved_quantity: 0,
    },
    {
      inventory_item_id: inventoryItems[1].id,
      location_id: location.id,
      stocked_quantity: 2,
      reserved_quantity: 0,
    },
  ])

  await remoteLink.create([
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
        inventory_item_id: inventoryItems[0].id,
      },
    },
    {
      [Modules.PRODUCT]: {
        variant_id: product.variants[1].id,
      },
      [Modules.INVENTORY]: {
        inventory_item_id: inventoryItems[1].id,
      },
    },
    {
      [Modules.PRODUCT]: {
        variant_id: product.variants[1].id,
      },
      [Modules.PRICING]: {
        price_set_id: priceSets[0].id,
      },
    },
  ])

  await pricingModule.createPricePreferences([
    {
      attribute: "region_id",
      value: region.id,
      is_tax_inclusive: true,
    },
  ])

  const shippingOptionData: FulfillmentWorkflow.CreateShippingOptionsWorkflowInput =
    {
      name: "Return shipping option",
      price_type: "flat",
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
      provider_id: providerId,
      type: {
        code: "manual-type",
        label: "Manual Type",
        description: "Manual Type Description",
      },
      prices: [
        {
          currency_code: "usd",
          amount: 10,
        },
        {
          region_id: region.id,
          amount: 100,
        },
      ],
      rules: [
        {
          attribute: "is_return",
          operator: RuleOperator.EQ,
          value: '"true"',
        },
      ],
    }

  const { result } = await createShippingOptionsWorkflow(container).run({
    input: [shippingOptionData],
  })

  const remoteQueryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_option",
    variables: {
      id: result[0].id,
    },
    fields: [
      "id",
      "name",
      "price_type",
      "service_zone_id",
      "shipping_profile_id",
      "provider_id",
      "data",
      "metadata",
      "type.*",
      "created_at",
      "updated_at",
      "deleted_at",
      "shipping_option_type_id",
      "prices.*",
    ],
  })

  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [createdShippingOption] = await remoteQuery(remoteQueryObject)
  return {
    shippingOption: createdShippingOption,
    region,
    salesChannel,
    location,
    product,
    fulfillmentSet,
    customer,
  }
}

async function createOrderFixture({
  container,
  product,
  salesChannel,
  customer,
  region,
}) {
  const orderService = container.resolve(Modules.ORDER)
  let order = await orderService.createOrders({
    region_id: region.id,
    email: "foo@bar.com",
    items: [
      {
        title: "Custom Item 2",
        variant_sku: product.variants[0].sku,
        variant_title: product.variants[0].title,
        quantity: 5,
        unit_price: 50,
        adjustments: [
          {
            code: "VIP_25 ETH",
            amount: "0.000000000000000005",
            description: "VIP discount",
            promotion_id: "prom_123",
            provider_id: "coupon_kings",
          },
        ],
      } as any,
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
        adjustments: [
          {
            code: "VIP_10",
            amount: 1,
            description: "VIP discount",
            promotion_id: "prom_123",
          },
        ],
      },
    ],
    currency_code: "eur",
    customer_id: customer.id,
  })

  await orderService.addOrderAction([
    {
      action: "FULFILL_ITEM",
      order_id: order.id,
      version: order.version,
      reference: "fullfilment",
      reference_id: "fulfill_123",
      details: {
        reference_id: order.items![0].id,
        quantity: 3,
      },
    },
    {
      action: "SHIP_ITEM",
      order_id: order.id,
      version: order.version,
      reference: "fullfilment",
      reference_id: "fulfill_123",
      details: {
        reference_id: order.items![0].id,
        quantity: 1,
      },
    },
  ])

  await orderService.applyPendingOrderActions(order.id)

  order = await orderService.retrieveOrder(order.id, {
    relations: ["items"],
  })

  return order
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Begin exchange order workflow", () => {
      let product: ProductDTO
      let salesChannel: SalesChannelDTO
      let customer: UserDTO
      let region: RegionDTO

      beforeEach(async () => {
        const fixtures = await prepareDataFixtures({
          container,
        })

        product = fixtures.product
        salesChannel = fixtures.salesChannel
        customer = fixtures.customer
        region = fixtures.region
      })

      it("should begin an exchange order, request item return", async () => {
        const order = await createOrderFixture({
          container,
          product,
          salesChannel,
          customer,
          region,
        })

        const createExchangeOrderData: OrderWorkflow.BeginOrderExchangeWorkflowInput =
          {
            order_id: order.id,
            metadata: {
              reason: "test",
              extra: "data",
              value: 1234,
            },
          }

        await beginExchangeOrderWorkflow.run({
          container,
          input: createExchangeOrderData,
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "order_exchange",
          variables: {
            order_id: createExchangeOrderData.order_id,
          },
          fields: ["order_id", "id", "metadata"],
        })

        const [exchangeOrder] = await remoteQuery(remoteQueryObject)

        expect(exchangeOrder.order_id).toEqual(order.id)
        expect(exchangeOrder.metadata).toEqual({
          reason: "test",
          extra: "data",
          value: 1234,
        })
        expect(exchangeOrder.id).toBeDefined()

        // Request itemm to return
        const { result: preview } =
          await orderExchangeRequestItemReturnWorkflow.run({
            throwOnError: true,
            container,
            input: {
              exchange_id: exchangeOrder.id,
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                },
              ],
            },
          })

        expect(preview.items[0]).toEqual(
          expect.objectContaining({
            quantity: 5,
            id: order.items![0].id,
            detail: expect.objectContaining({
              quantity: 5,
              fulfilled_quantity: 3,
              return_requested_quantity: 1,
            }),
            actions: [
              expect.objectContaining({
                order_id: order.id,
                exchange_id: exchangeOrder.id,
                version: 2,
                order_change_id: expect.any(String),
                reference: "return",
                reference_id: expect.stringContaining("return_"),
                action: "RETURN_ITEM",
                details: expect.objectContaining({
                  quantity: 1,
                  reference_id: order.items![0].id,
                }),
              }),
            ],
          })
        )

        const { errors } = await orderExchangeRequestItemReturnWorkflow.run({
          throwOnError: false,
          container,
          input: {
            exchange_id: exchangeOrder.id,
            items: [
              {
                id: order.items![0].id,
                quantity: 3,
              },
            ],
          },
        })
        expect(errors[0].error.message).toEqual(
          `Cannot request to return more items than what was fulfilled for item ${
            order.items![0].id
          }.`
        )

        const { result: anotherPreview } =
          await orderExchangeRequestItemReturnWorkflow.run({
            container,
            input: {
              exchange_id: exchangeOrder.id,
              items: [
                {
                  id: order.items![0].id,
                  quantity: 2,
                },
              ],
            },
          })

        expect(anotherPreview.items[0]).toEqual(
          expect.objectContaining({
            detail: expect.objectContaining({
              quantity: 5,
              fulfilled_quantity: 3,
              return_requested_quantity: 3,
            }),
            actions: [
              expect.objectContaining({
                reference_id: preview.items[0].actions[0].reference_id,
                action: "RETURN_ITEM",
                details: expect.objectContaining({
                  quantity: 1,
                }),
              }),
              expect.objectContaining({
                reference_id: preview.items[0].actions[0].reference_id,
                action: "RETURN_ITEM",
                details: expect.objectContaining({
                  quantity: 2,
                }),
              }),
            ],
          })
        )

        const { result: addItemPreview } =
          await orderExchangeAddNewItemWorkflow.run({
            container,
            input: {
              exchange_id: exchangeOrder.id,
              items: [
                {
                  variant_id: product.variants[1].id,
                  quantity: 2,
                  unit_price: 14.786,
                },
              ],
            },
          })

        expect(addItemPreview.items).toHaveLength(2)
        expect(addItemPreview.items[1].actions).toEqual([
          expect.objectContaining({
            action: "ITEM_ADD",
            reference: "order_exchange",
            reference_id: exchangeOrder.id,
            details: expect.objectContaining({
              quantity: 2,
              unit_price: 14.786,
            }),
          }),
        ])
      })
    })
  },
})
