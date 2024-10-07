import { IEventBusModuleService } from "@medusajs/types"
import { CommonEvents, Modules } from "@medusajs/utils"
import FormData from "form-data"
import fs from "fs/promises"
import { medusaIntegrationTestRunner, TestEventUtils } from "medusa-test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

const getUploadReq = (file: { name: string; content: string }) => {
  const form = new FormData()
  form.append("file", Buffer.from(file.content), file.name)
  return {
    form,
    meta: {
      headers: {
        ...adminHeaders.headers,
        ...form.getHeaders(),
      },
    },
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseCollection
    let baseType
    let baseProduct
    let baseRegion
    let baseCategory
    let baseTag1
    let baseTag2
    let baseTag3
    let newTag

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "base-collection" },
          adminHeaders
        )
      ).data.collection

      baseType = (
        await api.post(
          "/admin/product-types",
          { value: "test-type" },
          adminHeaders
        )
      ).data.product_type

      baseTag1 = (
        await api.post("/admin/product-tags", { value: "123" }, adminHeaders)
      ).data.product_tag

      baseTag2 = (
        await api.post("/admin/product-tags", { value: "123_1" }, adminHeaders)
      ).data.product_tag

      baseTag3 = (
        await api.post("/admin/product-tags", { value: "456" }, adminHeaders)
      ).data.product_tag

      newTag = (
        await api.post(
          "/admin/product-tags",
          { value: "new-tag" },
          adminHeaders
        )
      ).data.product_tag

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
            tags: [{ id: baseTag1.id }, { id: baseTag2.id }],
          }),
          adminHeaders
        )
      ).data.product

      baseRegion = (
        await api.post(
          "/admin/regions",
          {
            name: "Test region",
            currency_code: "USD",
          },
          adminHeaders
        )
      ).data.region

      baseCategory = (
        await api.post(
          "/admin/product-categories",
          { name: "Test", is_internal: false, is_active: true },
          adminHeaders
        )
      ).data.product_category
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/products/export", () => {
      // We want to ensure files with different delimiters are supported
      ;[
        { file: "exported-products-comma.csv", name: "delimited with comma" },
        {
          file: "exported-products-semicolon.csv",
          name: "delimited with semicolon",
        },
      ].forEach((testcase) => {
        it(`should import a previously exported products CSV file ${testcase.name}`, async () => {
          const subscriberExecution = TestEventUtils.waitSubscribersExecution(
            `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
            eventBus
          )

          let fileContent = await fs.readFile(
            path.join(__dirname, "__fixtures__", testcase.file),
            { encoding: "utf-8" }
          )

          fileContent = fileContent.replace(
            /prod_01J44RRJZ3M5F63NY82434RNM5/g,
            baseProduct.id
          )
          fileContent = fileContent.replace(
            /variant_01J44RRJZW1T9KQB6XG7Q6K61F/g,
            baseProduct.variants[0].id
          )
          fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
          fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

          const { form, meta } = getUploadReq({
            name: "test.csv",
            content: fileContent,
          })

          // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/import). The payload and response changed as well.
          const batchJobRes = await api.post(
            "/admin/products/import",
            form,
            meta
          )

          const transactionId = batchJobRes.data.transaction_id
          expect(transactionId).toBeTruthy()
          expect(batchJobRes.data.summary).toEqual({
            toCreate: 1,
            toUpdate: 1,
          })

          await api.post(
            `/admin/products/import/${transactionId}/confirm`,
            {},
            meta
          )

          await subscriberExecution
          const notifications = (
            await api.get("/admin/notifications", adminHeaders)
          ).data.notifications

          expect(notifications.length).toBe(1)
          expect(notifications[0]).toEqual(
            expect.objectContaining({
              data: expect.objectContaining({
                title: "Product import",
                description: `Product import of file test.csv completed successfully!`,
              }),
            })
          )

          const dbProducts = (await api.get("/admin/products", adminHeaders))
            .data.products

          expect(dbProducts).toHaveLength(2)
          expect(dbProducts).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                handle: "base-product",
                is_giftcard: false,
                thumbnail: "test-image.png",
                status: "draft",
                description: "test-product-description\ntest line 2",
                options: expect.arrayContaining([
                  expect.objectContaining({
                    title: "size",
                    values: expect.arrayContaining([
                      expect.objectContaining({
                        value: "small",
                      }),
                      expect.objectContaining({
                        value: "large",
                      }),
                    ]),
                  }),
                  expect.objectContaining({
                    title: "color",
                    values: expect.arrayContaining([
                      expect.objectContaining({
                        value: "green",
                      }),
                    ]),
                  }),
                ]),
                images: expect.arrayContaining([
                  expect.objectContaining({
                    url: "test-image.png",
                  }),
                  expect.objectContaining({
                    url: "test-image-2.png",
                  }),
                ]),
                tags: [
                  expect.objectContaining({
                    value: "123",
                  }),
                  expect.objectContaining({
                    value: "456",
                  }),
                ],
                type: expect.objectContaining({
                  id: baseType.id,
                }),
                collection: expect.objectContaining({
                  id: baseCollection.id,
                }),
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    title: "Test variant",
                    allow_backorder: false,
                    manage_inventory: true,
                    prices: expect.arrayContaining([
                      expect.objectContaining({
                        currency_code: "dkk",
                        amount: 30,
                      }),
                      expect.objectContaining({
                        currency_code: "eur",
                        amount: 45,
                      }),
                      expect.objectContaining({
                        currency_code: "usd",
                        amount: 100,
                      }),
                    ]),
                    options: expect.arrayContaining([
                      expect.objectContaining({
                        value: "large",
                      }),
                      expect.objectContaining({
                        value: "green",
                      }),
                    ]),
                  }),
                  expect.objectContaining({
                    title: "Test variant 2",
                    allow_backorder: false,
                    manage_inventory: true,
                    prices: expect.arrayContaining([
                      expect.objectContaining({
                        currency_code: "dkk",
                        amount: 50,
                      }),
                      expect.objectContaining({
                        currency_code: "eur",
                        amount: 65,
                      }),
                      expect.objectContaining({
                        currency_code: "usd",
                        amount: 200,
                      }),
                    ]),
                    options: expect.arrayContaining([
                      expect.objectContaining({
                        value: "small",
                      }),
                      expect.objectContaining({
                        value: "green",
                      }),
                    ]),
                  }),
                ]),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
              expect.objectContaining({
                id: expect.any(String),
                handle: "proposed-product",
                is_giftcard: false,
                thumbnail: "test-image.png",
                status: "proposed",
                description: "test-product-description",
                options: expect.arrayContaining([
                  expect.objectContaining({
                    title: "size",
                    values: expect.arrayContaining([
                      expect.objectContaining({
                        value: "large",
                      }),
                    ]),
                  }),
                  expect.objectContaining({
                    title: "color",
                    values: expect.arrayContaining([
                      expect.objectContaining({
                        value: "green",
                      }),
                    ]),
                  }),
                ]),
                images: expect.arrayContaining([
                  expect.objectContaining({
                    url: "test-image.png",
                  }),
                  expect.objectContaining({
                    url: "test-image-2.png",
                  }),
                ]),
                tags: [
                  expect.objectContaining({
                    value: "new-tag",
                  }),
                ],
                type: expect.objectContaining({
                  id: baseType.id,
                }),
                collection: null,
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    title: "Test variant",
                    allow_backorder: false,
                    manage_inventory: true,
                    prices: expect.arrayContaining([
                      expect.objectContaining({
                        currency_code: "dkk",
                        amount: 30,
                      }),
                      expect.objectContaining({
                        currency_code: "eur",
                        amount: 45,
                      }),
                      expect.objectContaining({
                        currency_code: "usd",
                        amount: 100,
                      }),
                    ]),
                    options: expect.arrayContaining([
                      expect.objectContaining({
                        value: "large",
                      }),
                      expect.objectContaining({
                        value: "green",
                      }),
                    ]),
                  }),
                ]),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ])
          )
        })
      })

      it("should import product with categories", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "product-with-categories.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/prod_\w*\d*/g, baseProduct.id)
        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)
        fileContent = fileContent.replace(/pcat_\w*\d*/g, baseCategory.id)

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 0,
          toUpdate: 1,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const dbProducts = (
          await api.get("/admin/products?fields=*categories", adminHeaders)
        ).data.products

        expect(dbProducts).toHaveLength(1)
        expect(dbProducts[0]).toEqual(
          expect.objectContaining({
            id: baseProduct.id,
            categories: [expect.objectContaining({ id: baseCategory.id })],
          })
        )
      })

      it("should fail on invalid region in prices being present in the CSV", async () => {
        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "invalid-prices.csv"),
          { encoding: "utf-8" }
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const err = await api
          .post("/admin/products/import", form, meta)
          .catch((e) => e)
        expect(err.response.data.message).toEqual(
          "Region with name nonexistent not found"
        )
      })

      it("should ignore non-existent fields being present in the CSV that don't start with Product or Variant", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "unrelated-column.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 1,
          toUpdate: 0,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product import",
              description: `Product import of file test.csv completed successfully!`,
            }),
          })
        )
      })

      it("should fail on non-existent product fields being present in the CSV", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "invalid-column.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 1,
          toUpdate: 0,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product import",
              description: `Failed to import products from file test.csv`,
            }),
          })
        )
      })

      it("supports importing the v1 template", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "v1-template.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(
          /existing-product-id/g,
          baseProduct.id
        )
        fileContent = fileContent.replace(
          /existing-variant-id/g,
          baseProduct.variants[0].id
        )
        fileContent = fileContent.replace(/test-type/g, baseType.value)
        fileContent = fileContent.replace(
          /test-collection1/g,
          baseCollection.handle
        )
        fileContent = fileContent.replace(
          /test-collection2/g,
          baseCollection.handle
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)
        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 2,
          toUpdate: 1,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const dbProducts = (await api.get("/admin/products", adminHeaders)).data
          .products

        expect(dbProducts).toHaveLength(3)
        expect(dbProducts).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: baseProduct.id,
              handle: "test-product-product-2",
              title: "Test product",
              is_giftcard: false,
              thumbnail: "test-image.png",
              status: "draft",
              description: "test-product-description",
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "Size",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "Small",
                    }),
                    expect.objectContaining({
                      value: "Medium",
                    }),
                    expect.objectContaining({
                      value: "Large",
                    }),
                  ]),
                }),
              ]),
              images: expect.arrayContaining([
                expect.objectContaining({
                  url: "test-image.png",
                }),
              ]),
              tags: [
                expect.objectContaining({
                  value: "123",
                }),
              ],
              type: expect.objectContaining({
                id: baseType.id,
              }),
              collection: expect.objectContaining({
                id: baseCollection.id,
              }),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "Test variant",
                  sku: "test-sku-2",
                  barcode: "test-barcode-2",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: [
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 1.1,
                    }),
                  ],
                  options: [
                    expect.objectContaining({
                      value: "Small",
                    }),
                  ],
                }),
                expect.objectContaining({
                  title: "Test variant",
                  sku: "test-sku-3",
                  barcode: "test-barcode-3",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: [
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 1.2,
                    }),
                  ],
                  options: [
                    expect.objectContaining({
                      value: "Medium",
                    }),
                  ],
                }),
                expect.objectContaining({
                  id: baseProduct.variants[0].id,
                  title: "Test variant changed",
                  sku: "test-sku-4",
                  barcode: "test-barcode-4",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 100,
                    }),

                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 45,
                    }),
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 30,
                    }),
                  ]),
                  options: [
                    expect.objectContaining({
                      value: "Large",
                    }),
                  ],
                }),
              ]),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.any(String),
              title: "Test product",
              handle: "test-product-product-1-1",
              is_giftcard: false,
              thumbnail: "test-image.png",
              status: "draft",
              description:
                "Hopper Stripes Bedding, available as duvet cover, pillow sham and sheet.\\n100% organic cotton, soft and crisp to the touch. Made in Portugal.",
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "test-option-1",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "option 1 value red",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "test-option-2",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "option 2 value 1",
                    }),
                  ]),
                }),
              ]),
              images: expect.arrayContaining([
                expect.objectContaining({
                  url: "test-image.png",
                }),
              ]),
              tags: [],
              type: null,
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "Test variant",
                  sku: "test-sku-1-1",
                  barcode: "test-barcode-1-1",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      currency_code: "usd",
                      rules: {
                        region_id: baseRegion.id,
                      },
                      amount: 1,
                    }),
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 1.1,
                    }),
                  ]),
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      value: "option 1 value red",
                    }),
                    expect.objectContaining({
                      value: "option 2 value 1",
                    }),
                  ]),
                }),
              ]),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),

            expect.objectContaining({
              id: expect.any(String),
              title: "Test product",
              handle: "test-product-product-1",
            }),
          ])
        )
      })

      it("should fail when a v1 import has non existent collection", async () => {
        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "v1-template.csv"),
          { encoding: "utf-8" }
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const err = await api
          .post("/admin/products/import", form, meta)
          .catch((e) => e)
        expect(err.response.data.message).toEqual(
          "Product collection with handle 'test-collection1' does not exist"
        )
      })
    })
  },
})
