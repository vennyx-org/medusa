import {
  CreatePriceSetDTO,
  IPricingModuleService,
} from "@medusajs/framework/types"
import {
  CommonEvents,
  composeMessage,
  Modules,
  PricingEvents,
} from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { seedPriceData } from "../../../__fixtures__/seed-price-data"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IPricingModuleService>({
  moduleName: Modules.PRICING,
  testSuite: ({ MikroOrmWrapper, service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("PricingModule Service - PriceSet", () => {
      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()
        await seedPriceData(testManager)
      })

      describe("list", () => {
        it("list priceSets", async () => {
          const priceSetsResult = await service.listPriceSets()

          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              id: "price-set-1",
            }),
            expect.objectContaining({
              id: "price-set-2",
            }),
            expect.objectContaining({
              id: "price-set-3",
            }),
          ])
        })

        it("list priceSets by id", async () => {
          const priceSetsResult = await service.listPriceSets({
            id: ["price-set-1"],
          })

          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              id: "price-set-1",
            }),
          ])
        })

        it("list priceSets with relations and selects", async () => {
          const priceSetsResult = await service.listPriceSets(
            {
              id: ["price-set-1"],
            },
            {
              select: ["id", "prices.id", "prices.amount"],
              relations: ["prices"],
            }
          )

          const serialized = JSON.parse(JSON.stringify(priceSetsResult))

          expect(serialized).toEqual([
            {
              id: "price-set-1",
              prices: [
                expect.objectContaining({
                  id: "price-set-money-amount-USD",
                  amount: 500,
                }),
              ],
            },
          ])
        })

        it("list priceSets should return only prices from a price set (and not the ones from a price list)", async () => {
          const [priceList] = await service.createPriceLists([
            {
              title: "test",
              description: "test",
              prices: [
                {
                  amount: 400,
                  currency_code: "EUR",
                  price_set_id: "price-set-1",
                  rules: {
                    region_id: "DE",
                  },
                },
                {
                  amount: 600,
                  currency_code: "EUR",
                  price_set_id: "price-set-1",
                },
              ],
            },
          ])

          const priceSetsResult = await service.listPriceSets(
            {
              id: ["price-set-1"],
            },
            {
              relations: ["prices"],
            }
          )

          expect(priceSetsResult).toHaveLength(1)
          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              id: "price-set-1",
              prices: [
                expect.objectContaining({
                  id: "price-set-money-amount-USD",
                  amount: 500,
                }),
              ],
            }),
          ])
        })
      })

      describe("listAndCount", () => {
        it("should return priceSets and count", async () => {
          const [priceSetsResult, count] = await service.listAndCountPriceSets()

          expect(count).toEqual(3)
          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              id: "price-set-1",
            }),
            expect.objectContaining({
              id: "price-set-2",
            }),
            expect.objectContaining({
              id: "price-set-3",
            }),
          ])
        })

        it("should return priceSets and count when filtered", async () => {
          const [priceSetsResult, count] = await service.listAndCountPriceSets({
            id: ["price-set-1"],
          })

          expect(count).toEqual(1)
          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              id: "price-set-1",
            }),
          ])
        })

        it("list priceSets with relations and selects", async () => {
          const [priceSetsResult, count] = await service.listAndCountPriceSets(
            {
              id: ["price-set-1"],
            },
            {
              select: ["id", "prices.amount", "prices.id"],
              relations: ["prices"],
            }
          )

          const serialized = JSON.parse(JSON.stringify(priceSetsResult))

          expect(count).toEqual(1)
          expect(serialized).toEqual([
            {
              id: "price-set-1",
              prices: [
                expect.objectContaining({
                  id: "price-set-money-amount-USD",
                  amount: 500,
                }),
              ],
            },
          ])
        })

        it("should return priceSets and count when using skip and take", async () => {
          const [priceSetsResult, count] = await service.listAndCountPriceSets(
            {},
            { skip: 1, take: 1 }
          )

          expect(count).toEqual(3)
          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              id: "price-set-2",
            }),
          ])
        })

        it("should return requested fields", async () => {
          const [priceSetsResult, count] = await service.listAndCountPriceSets(
            {},
            {
              take: 1,
              select: ["id"],
            }
          )

          const serialized = JSON.parse(JSON.stringify(priceSetsResult))

          expect(count).toEqual(3)
          expect(serialized).toEqual([
            {
              id: "price-set-1",
            },
          ])
        })
      })

      describe("retrieve", () => {
        const id = "price-set-1"

        it("should return priceSet for the given id", async () => {
          const priceSet = await service.retrievePriceSet(id)

          expect(priceSet).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when priceSet with id does not exist", async () => {
          let error

          try {
            await service.retrievePriceSet("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "PriceSet with id: does-not-exist was not found"
          )
        })

        it("should throw an error when a id is not provided", async () => {
          let error

          try {
            await service.retrievePriceSet(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("priceSet - id must be defined")
        })

        it("should return priceSet based on config select param", async () => {
          const priceSet = await service.retrievePriceSet(id, {
            select: ["id"],
          })

          const serialized = JSON.parse(JSON.stringify(priceSet))

          expect(serialized).toEqual({
            id,
          })
        })

        it("should return priceSet with only its own prices", async () => {
          const [priceList] = await service.createPriceLists([
            {
              title: "test",
              description: "test",
              prices: [
                {
                  amount: 400,
                  currency_code: "EUR",
                  price_set_id: id,
                  rules: {
                    region_id: "DE",
                  },
                },
                {
                  amount: 600,
                  currency_code: "EUR",
                  price_set_id: id,
                },
              ],
            },
          ])

          const priceSetResult = await service.retrievePriceSet(id, {
            relations: ["prices"],
          })

          expect(priceSetResult).toEqual(
            expect.objectContaining({
              id: "price-set-1",
              prices: [
                expect.objectContaining({
                  id: "price-set-money-amount-USD",
                  amount: 500,
                }),
              ],
            })
          )
        })
      })

      describe("delete", () => {
        const id = "price-set-1"

        it("should delete the priceSets given an id successfully", async () => {
          await service.deletePriceSets([id])

          const priceSets = await service.listPriceSets({
            id: [id],
          })

          expect(priceSets).toHaveLength(0)
        })
      })

      describe("update", () => {
        const id = "price-set-1"

        it("should throw an error when an id does not exist", async () => {
          let error = await service
            .updatePriceSets("does-not-exist", {})
            .catch((e) => e.message)

          expect(error).toEqual(
            "PriceSet with id: does-not-exist was not found"
          )
        })

        it("should create, update, and delete prices to a price set", async () => {
          const priceSetBefore = await service.retrievePriceSet(id, {
            relations: ["prices"],
          })

          const updateResponse = await service.updatePriceSets(
            priceSetBefore.id,
            {
              prices: [
                { amount: 100, currency_code: "USD" },
                { amount: 200, currency_code: "EUR" },
              ],
            }
          )

          const priceSetAfter = await service.retrievePriceSet(id, {
            relations: ["prices"],
          })
          expect(priceSetBefore.prices).toHaveLength(1)
          expect(priceSetBefore.prices?.[0]).toEqual(
            expect.objectContaining({
              amount: 500,
              currency_code: "USD",
            })
          )

          expect(priceSetAfter.prices).toHaveLength(2)
          expect(priceSetAfter.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                currency_code: "USD",
              }),
              expect.objectContaining({
                amount: 200,
                currency_code: "EUR",
              }),
            ])
          )
          expect(updateResponse.prices).toHaveLength(2)
          expect(updateResponse.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                currency_code: "USD",
              }),
              expect.objectContaining({
                amount: 200,
                currency_code: "EUR",
              }),
            ])
          )
        })

        it("should update price set prices and preserve price list prices", async () => {
          const priceSetBefore = await service.retrievePriceSet(id, {
            relations: ["prices"],
          })

          const [pl] = await service.createPriceLists([
            {
              title: "test",
              description: "test",

              prices: [
                {
                  amount: 400,
                  currency_code: "EUR",
                  price_set_id: priceSetBefore.id,
                },
              ],
            },
          ])

          const updateResponse = await service.updatePriceSets(
            priceSetBefore.id,
            {
              prices: [
                { amount: 100, currency_code: "USD" },
                { amount: 200, currency_code: "EUR" },
              ],
            }
          )

          const priceSetAfter = await service.retrievePriceSet(id, {
            relations: ["prices"],
          })

          expect(priceSetBefore.prices).toHaveLength(1)
          expect(priceSetBefore.prices?.[0]).toEqual(
            expect.objectContaining({
              amount: 500,
              currency_code: "USD",
            })
          )

          // Price list prices are not present in this response
          expect(priceSetAfter.prices).toHaveLength(2)
          expect(priceSetAfter.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                currency_code: "USD",
              }),
              expect.objectContaining({
                amount: 200,
                currency_code: "EUR",
              }),
            ])
          )
          expect(updateResponse.prices).toHaveLength(2)
          expect(updateResponse.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                currency_code: "USD",
              }),
              expect.objectContaining({
                amount: 200,
                currency_code: "EUR",
              }),
            ])
          )

          const plAfter = await service.retrievePriceList(pl.id, {
            relations: ["prices"],
          })

          // Price list prices are preserved
          expect(plAfter.prices).toHaveLength(1)
          expect(plAfter.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                currency_code: "EUR",
                price_set_id: priceSetBefore.id,
              }),
            ])
          )
        })

        it("should upsert the later price when setting a price set with existing equivalent rules", async () => {
          await service.updatePriceSets(id, {
            prices: [
              {
                amount: 100,
                currency_code: "USD",
                rules: { region_id: "1234" },
              },
              {
                amount: 200,
                currency_code: "USD",
                rules: { region_id: "1234" },
              },
            ],
          })

          const priceSet = await service.retrievePriceSet(id, {
            relations: ["prices", "prices.price_rules"],
          })

          expect(priceSet.prices).toEqual([
            expect.objectContaining({
              amount: 200,
              currency_code: "USD",
              price_rules: [
                expect.objectContaining({
                  attribute: "region_id",
                  value: "1234",
                }),
              ],
            }),
          ])
        })
      })

      describe("create", () => {
        it("should create a price set with rule types and money amounts", async () => {
          const [priceSet] = await service.createPriceSets([
            {
              prices: [
                {
                  amount: 100,
                  currency_code: "USD",
                  rules: {
                    region_id: "1",
                  },
                },
              ],
            },
          ])

          expect(priceSet).toEqual(
            expect.objectContaining({
              prices: [
                expect.objectContaining({
                  amount: 100,
                  currency_code: "USD",
                  rules_count: 1,
                }),
              ],
            })
          )

          const events = eventBusEmitSpy.mock.calls[0][0]
          expect(events).toHaveLength(3)
          expect(events[0]).toEqual(
            composeMessage(PricingEvents.PRICE_SET_CREATED, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_set",
              data: { id: priceSet.id },
            })
          )

          expect(events[1]).toEqual(
            composeMessage(PricingEvents.PRICE_CREATED, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price",
              data: { id: priceSet.prices![0].id },
            })
          )

          expect(events[2]).toEqual(
            composeMessage(PricingEvents.PRICE_RULE_CREATED, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_rule",
              data: {
                id: (priceSet as any).prices![0].price_rules[0].id,
              },
            })
          )
        })

        it("should create a price set with prices", async () => {
          const [priceSet] = await service.createPriceSets([
            {
              prices: [
                {
                  amount: 100,
                  currency_code: "USD",
                  rules: {
                    region_id: "1",
                  },
                },
                {
                  amount: 150,
                  currency_code: "USD",
                },
              ],
            },
          ])

          expect(priceSet).toEqual(
            expect.objectContaining({
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 100,
                  currency_code: "USD",
                }),
                expect.objectContaining({
                  amount: 150,
                  currency_code: "USD",
                }),
              ]),
            })
          )
        })

        it("should create a priceSet successfully", async () => {
          await service.createPriceSets([
            {
              id: "price-set-new",
            } as unknown as CreatePriceSetDTO,
          ])

          const [priceSet] = await service.listPriceSets({
            id: ["price-set-new"],
          })

          expect(priceSet).toEqual(
            expect.objectContaining({
              id: "price-set-new",
            })
          )
        })

        it("should take the later price when passing two prices with equivalent rules", async () => {
          await service.createPriceSets([
            {
              id: "price-set-new",
              prices: [
                {
                  amount: 100,
                  currency_code: "USD",
                  rules: { region_id: "1234" },
                },
                {
                  amount: 200,
                  currency_code: "USD",
                  rules: { region_id: "1234" },
                },
              ],
            } as unknown as CreatePriceSetDTO,
          ])

          const priceSet = await service.retrievePriceSet("price-set-new", {
            relations: ["prices", "prices.price_rules"],
          })

          expect(priceSet.prices).toEqual([
            expect.objectContaining({
              amount: 200,
              currency_code: "USD",
              price_rules: [
                expect.objectContaining({
                  attribute: "region_id",
                  value: "1234",
                }),
              ],
            }),
          ])
        })
      })

      describe("addPrices", () => {
        it("should add prices to existing price set", async () => {
          await service.addPrices([
            {
              priceSetId: "price-set-1",
              prices: [
                {
                  amount: 100,
                  currency_code: "USD",
                  rules: { region_id: "1234" },
                },
              ],
            },
          ])

          const [priceSet] = await service.listPriceSets(
            { id: ["price-set-1"] },
            { relations: ["prices", "prices.price_rules"] }
          )

          expect(priceSet).toEqual(
            expect.objectContaining({
              id: "price-set-1",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 100,
                  currency_code: "USD",
                }),
              ]),
            })
          )

          const events = eventBusEmitSpy.mock.calls[0][0]
          expect(events).toHaveLength(2)
          expect(events[0]).toEqual(
            composeMessage(PricingEvents.PRICE_CREATED, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price",
              data: { id: priceSet.prices![1].id },
            })
          )
          expect(events[1]).toEqual(
            composeMessage(PricingEvents.PRICE_RULE_CREATED, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_rule",
              data: { id: priceSet.prices![1].price_rules[0].id },
            })
          )
        })

        it("should add prices to multiple existing price set", async () => {
          await service.addPrices([
            {
              priceSetId: "price-set-1",
              prices: [
                {
                  amount: 100,
                  currency_code: "USD",
                  rules: { region_id: "region-1" },
                },
              ],
            },
            {
              priceSetId: "price-set-2",
              prices: [
                {
                  amount: 150,
                  currency_code: "EUR",
                  rules: { region_id: "region-2" },
                },
              ],
            },
          ])

          const priceSets = await service.listPriceSets(
            { id: ["price-set-1", "price-set-2"] },
            { relations: ["prices"] }
          )

          expect(priceSets).toEqual([
            expect.objectContaining({
              id: "price-set-1",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 100,
                  currency_code: "USD",
                }),
              ]),
            }),
            expect.objectContaining({
              id: "price-set-2",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 150,
                  currency_code: "EUR",
                }),
              ]),
            }),
          ])
        })

        it("should do an update if a price exists with the equivalent rules", async () => {
          await service.addPrices([
            {
              priceSetId: "price-set-1",
              prices: [
                {
                  amount: 100,
                  currency_code: "USD",
                  rules: { region_id: "123" },
                },
              ],
            },
          ])

          await service.addPrices([
            {
              priceSetId: "price-set-1",
              prices: [
                {
                  amount: 200,
                  currency_code: "USD",
                  rules: { region_id: "123" },
                },
              ],
            },
          ])

          const priceSet = await service.retrievePriceSet("price-set-1", {
            relations: ["prices", "prices.price_rules"],
          })

          expect(
            priceSet.prices?.sort((a: any, b: any) => a.amount - b.amount)
          ).toEqual([
            expect.objectContaining({
              amount: 200,
              currency_code: "USD",
              price_rules: [
                expect.objectContaining({
                  attribute: "region_id",
                  value: "123",
                }),
              ],
            }),
            expect.objectContaining({
              amount: 500,
              currency_code: "USD",
            }),
          ])
        })
      })
    })
  },
})
