import { IEventBusModuleService } from "@medusajs/types"
import { CommonEvents, Modules } from "@medusajs/utils"
import fs from "fs/promises"
import { TestEventUtils, medusaIntegrationTestRunner } from "medusa-test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

const compareCSVs = async (filePath, expectedFilePath) => {
  const asLocalPath = filePath.replace("http://localhost:9000", process.cwd())
  let fileContent = await fs.readFile(asLocalPath, { encoding: "utf-8" })
  let fixturesContent = await fs.readFile(expectedFilePath, {
    encoding: "utf-8",
  })
  await fs.rm(path.dirname(asLocalPath), { recursive: true, force: true })

  // Normalize csv data to get rid of dynamic data
  const idsToReplace = ["prod_", "pcol_", "variant_", "ptyp_", "pcat_"]
  const dateRegex =
    /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/g
  idsToReplace.forEach((prefix) => {
    fileContent = fileContent.replace(
      new RegExp(`${prefix}\\w*\\d*`, "g"),
      "<ID>"
    )
    fixturesContent = fixturesContent.replace(
      new RegExp(`${prefix}\\w*\\d*`, "g"),
      "<ID>"
    )
  })
  fileContent = fileContent.replace(dateRegex, "<DATE>")
  fixturesContent = fixturesContent.replace(dateRegex, "<DATE>")

  expect(fileContent).toEqual(fixturesContent)
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseProduct
    let proposedProduct

    let baseCollection
    let publishedCollection

    let baseType
    let baseRegion
    let baseCategory
    let baseTag1
    let baseTag2
    let newTag

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

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

      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "base-collection" },
          adminHeaders
        )
      ).data.collection

      publishedCollection = (
        await api.post(
          "/admin/collections",
          { title: "proposed-collection" },
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

      baseCategory = (
        await api.post(
          "/admin/product-categories",
          { name: "Test", is_internal: false, is_active: true },
          adminHeaders
        )
      ).data.product_category

      baseTag1 = (
        await api.post("/admin/product-tags", { value: "123" }, adminHeaders)
      ).data.product_tag

      baseTag2 = (
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
            description: "test-product-description\ntest line 2",
            collection_id: baseCollection.id,
            type_id: baseType.id,
            categories: [{ id: baseCategory.id }],
            tags: [{ id: baseTag1.id }, { id: baseTag2.id }],
            variants: [
              {
                title: "Test variant",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 100,
                  },
                  {
                    currency_code: "eur",
                    amount: 45,
                  },
                  {
                    currency_code: "dkk",
                    amount: 30,
                  },
                ],
                options: {
                  size: "large",
                  color: "green",
                },
              },
              {
                title: "Test variant 2",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 200,
                  },
                  {
                    currency_code: "eur",
                    amount: 65,
                  },
                  {
                    currency_code: "dkk",
                    amount: 50,
                  },
                ],
                options: {
                  size: "small",
                  color: "green",
                },
              },
            ],
          }),
          adminHeaders
        )
      ).data.product

      proposedProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Proposed product",
            status: "proposed",
            tags: [{ id: newTag.id }],
            type_id: baseType.id,
          }),
          adminHeaders
        )
      ).data.product
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/products/export", () => {
      it("should export a csv file containing the expected products", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/export). The payload and response changed as well.
        const batchJobRes = await api.post(
          "/admin/products/export",
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product export",
              description: "Product export completed successfully!",
              file: expect.objectContaining({
                url: expect.stringContaining("-product-exports.csv"),
                filename: expect.any(String),
                mimeType: "text/csv",
              }),
            }),
          })
        )

        await compareCSVs(
          notifications[0].data.file.url,
          path.join(__dirname, "__fixtures__", "exported-products-comma.csv")
        )
      })

      it("should export a csv file with categories", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const batchJobRes = await api.post(
          `/admin/products/export?id=${baseProduct.id}&fields=*categories`,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        await compareCSVs(
          notifications[0].data.file.url,
          path.join(__dirname, "__fixtures__", "product-with-categories.csv")
        )
      })

      it("should export a csv file with region prices", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const productWithRegionPrices = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "Product with prices",
              tags: [{ id: baseTag1.id }, { id: baseTag2.id }],
              variants: [
                {
                  title: "Test variant",
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                    {
                      currency_code: "usd",
                      rules: {
                        region_id: baseRegion.id,
                      },
                      amount: 45,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            }),
            adminHeaders
          )
        ).data.product

        const batchJobRes = await api.post(
          "/admin/products/export?id=" + productWithRegionPrices.id,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        await compareCSVs(
          notifications[0].data.file.url,
          path.join(__dirname, "__fixtures__", "prices-with-region.csv")
        )
      })

      it("should export a csv file filtered by specific products", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        // BREAKING: We don't support setting batch size in the export anymore
        const batchJobRes = await api.post(
          `/admin/products/export?id=${proposedProduct.id}`,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)

        await compareCSVs(
          notifications[0].data.file.url,
          path.join(__dirname, "__fixtures__", "filtered-products.csv")
        )
      })
    })
  },
})
