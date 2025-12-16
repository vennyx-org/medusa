import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { MedusaContainer } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(100000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Translation API", () => {
      let appContainer: MedusaContainer

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        const storeModule = appContainer.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          {
            select: ["id"],
            take: 1,
          }
        )
        await storeModule.updateStores(defaultStore.id, {
          supported_locales: [
            { locale_code: "en-US", is_default: true },
            { locale_code: "fr-FR" },
            { locale_code: "de-DE" },
          ],
        })
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      describe("GET /admin/translations", () => {
        it("should list translations (empty initially)", async () => {
          const response = await api.get("/admin/translations", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data).toEqual(
            expect.objectContaining({
              translations: [],
              count: 0,
              offset: 0,
              limit: 20,
            })
          )
        })

        it("should list translations after creating some", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_123",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre du produit",
                    description: "Description en français",
                  },
                },
                {
                  reference_id: "prod_123",
                  reference: "product",
                  locale_code: "de-DE",
                  translations: {
                    title: "Produkttitel",
                    description: "Beschreibung auf Deutsch",
                  },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get("/admin/translations", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(2)
          expect(response.data.count).toEqual(2)
          expect(response.data.translations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Titre du produit",
                  description: "Description en français",
                },
              }),
              expect.objectContaining({
                reference_id: "prod_123",
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Produkttitel",
                  description: "Beschreibung auf Deutsch",
                },
              }),
            ])
          )
        })

        it("should filter translations by reference_id", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Un" },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Deux" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?reference_id=prod_1",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].reference_id).toEqual("prod_1")
        })

        it("should filter translations by reference", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit" },
                },
                {
                  reference_id: "cat_1",
                  reference: "product_category",
                  locale_code: "fr-FR",
                  translations: { name: "Catégorie" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?reference=product_category",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].reference).toEqual(
            "product_category"
          )
        })

        it("should filter translations by locale_code", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Titre français" },
                },
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "de-DE",
                  translations: { title: "Deutscher Titel" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?locale_code=de-DE",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].locale_code).toEqual("de-DE")
        })

        it("should filter translations by multiple criteria", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Un FR" },
                },
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "de-DE",
                  translations: { title: "Produkt Eins DE" },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Deux FR" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?reference_id=prod_1&locale_code=fr-FR",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0]).toEqual(
            expect.objectContaining({
              reference_id: "prod_1",
              locale_code: "fr-FR",
              translations: { title: "Produit Un FR" },
            })
          )
        })

        it("should support pagination", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit 1" },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit 2" },
                },
                {
                  reference_id: "prod_3",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit 3" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?limit=2&offset=0",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(2)
          expect(response.data.count).toEqual(3)
          expect(response.data.limit).toEqual(2)
          expect(response.data.offset).toEqual(0)

          const response2 = await api.get(
            "/admin/translations?limit=2&offset=2",
            adminHeaders
          )

          expect(response2.status).toEqual(200)
          expect(response2.data.translations).toHaveLength(1)
          expect(response2.data.offset).toEqual(2)
        })

        it("should filter translations using q parameter (JSONB search)", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Chaussures de sport",
                    description: "Des chaussures confortables",
                  },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "T-shirt de sport",
                    description: "Un t-shirt léger",
                  },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?q=chaussures",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].reference_id).toEqual("prod_1")
        })
      })

      describe("POST /admin/translations/batch", () => {
        describe("create", () => {
          it("should create a single translation", async () => {
            const response = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: {
                      title: "Titre du produit",
                    },
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(1)
            expect(response.data.created[0]).toEqual(
              expect.objectContaining({
                id: expect.stringMatching(/^trans_/),
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Titre du produit",
                },
              })
            )
          })

          it("should create multiple translations", async () => {
            const response = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Titre FR" },
                  },
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "de-DE",
                    translations: { title: "Titel DE" },
                  },
                  {
                    reference_id: "var_456",
                    reference: "product_variant",
                    locale_code: "fr-FR",
                    translations: { title: "Variante FR" },
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(3)
          })

          it("should create translations for different entity types", async () => {
            const response = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Produit" },
                  },
                  {
                    reference_id: "cat_456",
                    reference: "product_category",
                    locale_code: "fr-FR",
                    translations: { name: "Catégorie" },
                  },
                  {
                    reference_id: "col_789",
                    reference: "product_collection",
                    locale_code: "fr-FR",
                    translations: { title: "Collection" },
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(3)
            expect(response.data.created).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ reference: "product" }),
                expect.objectContaining({ reference: "product_category" }),
                expect.objectContaining({ reference: "product_collection" }),
              ])
            )
          })
        })

        describe("update", () => {
          it("should update an existing translation", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Ancien titre" },
                  },
                ],
              },
              adminHeaders
            )

            const translationId = createResponse.data.created[0].id

            const updateResponse = await api.post(
              "/admin/translations/batch",
              {
                update: [
                  {
                    id: translationId,
                    translations: { title: "Nouveau titre" },
                  },
                ],
              },
              adminHeaders
            )

            expect(updateResponse.status).toEqual(200)
            expect(updateResponse.data.updated).toHaveLength(1)
            expect(updateResponse.data.updated[0]).toEqual(
              expect.objectContaining({
                id: translationId,
                translations: { title: "Nouveau titre" },
              })
            )
          })

          it("should update multiple translations", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_1",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Titre 1" },
                  },
                  {
                    reference_id: "prod_2",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Titre 2" },
                  },
                ],
              },
              adminHeaders
            )

            const [trans1, trans2] = createResponse.data.created

            const updateResponse = await api.post(
              "/admin/translations/batch",
              {
                update: [
                  { id: trans1.id, translations: { title: "Nouveau 1" } },
                  { id: trans2.id, translations: { title: "Nouveau 2" } },
                ],
              },
              adminHeaders
            )

            expect(updateResponse.status).toEqual(200)
            expect(updateResponse.data.updated).toHaveLength(2)
          })
        })

        describe("delete", () => {
          it("should delete a translation", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "À supprimer" },
                  },
                ],
              },
              adminHeaders
            )

            const translationId = createResponse.data.created[0].id

            const deleteResponse = await api.post(
              "/admin/translations/batch",
              {
                delete: [translationId],
              },
              adminHeaders
            )

            expect(deleteResponse.status).toEqual(200)
            expect(deleteResponse.data.deleted).toEqual({
              ids: [translationId],
              object: "translation",
              deleted: true,
            })

            const listResponse = await api.get(
              `/admin/translations?reference_id=prod_123`,
              adminHeaders
            )
            expect(listResponse.data.translations).toHaveLength(0)
          })

          it("should delete multiple translations", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_1",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Supprimer 1" },
                  },
                  {
                    reference_id: "prod_2",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Supprimer 2" },
                  },
                ],
              },
              adminHeaders
            )

            const ids = createResponse.data.created.map((t) => t.id)

            const deleteResponse = await api.post(
              "/admin/translations/batch",
              {
                delete: ids,
              },
              adminHeaders
            )

            expect(deleteResponse.status).toEqual(200)
            expect(deleteResponse.data.deleted.ids).toHaveLength(2)
          })
        })

        describe("combined operations", () => {
          it("should handle create, update, and delete in a single batch", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_existing",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Existant" },
                  },
                  {
                    reference_id: "prod_to_delete",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "À supprimer" },
                  },
                ],
              },
              adminHeaders
            )

            const existingId = createResponse.data.created[0].id
            const toDeleteId = createResponse.data.created[1].id

            const batchResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_new",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Nouveau" },
                  },
                ],
                update: [
                  {
                    id: existingId,
                    translations: { title: "Mis à jour" },
                  },
                ],
                delete: [toDeleteId],
              },
              adminHeaders
            )

            expect(batchResponse.status).toEqual(200)
            expect(batchResponse.data.created).toHaveLength(1)
            expect(batchResponse.data.updated).toHaveLength(1)
            expect(batchResponse.data.deleted.ids).toContain(toDeleteId)

            expect(batchResponse.data.created[0].translations.title).toEqual(
              "Nouveau"
            )
            expect(batchResponse.data.updated[0].translations.title).toEqual(
              "Mis à jour"
            )
          })
        })
      })
    })
  },
})
