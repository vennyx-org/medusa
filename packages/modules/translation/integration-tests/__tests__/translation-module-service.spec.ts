import { ITranslationModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import TranslationModuleService from "@services/translation-module"
import { createLocaleFixture, createTranslationFixture } from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<ITranslationModuleService>({
  moduleName: Modules.TRANSLATION,
  testSuite: ({ service }) => {
    describe("Translation Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.TRANSLATION, {
          service: TranslationModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual(["locale", "translation"])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          locale: {
            id: {
              linkable: "locale_id",
              entity: "Locale",
              primaryKey: "id",
              serviceName: "translation",
              field: "locale",
            },
          },
          translation: {
            id: {
              linkable: "translation_id",
              entity: "Translation",
              primaryKey: "id",
              serviceName: "translation",
              field: "translation",
            },
          },
        })
      })

      describe("Locale", () => {
        describe("creating a locale", () => {
          it("should create a locale successfully", async () => {
            const locale = await service.createLocales(createLocaleFixture)

            expect(locale).toEqual(
              expect.objectContaining({
                code: "test-LC",
                name: "Test Locale",
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              })
            )
          })

          it("should create multiple locales successfully", async () => {
            const locales = await service.createLocales([
              createLocaleFixture,
              { code: "test-LC2", name: "Test Locale 2" },
            ])

            expect(locales).toHaveLength(2)
            expect(locales[0].code).toEqual("test-LC")
            expect(locales[1].code).toEqual("test-LC2")
          })
        })

        describe("retrieving a locale", () => {
          it("should retrieve a locale by id", async () => {
            const created = await service.createLocales(createLocaleFixture)
            const retrieved = await service.retrieveLocale(created.id)

            expect(retrieved).toEqual(
              expect.objectContaining({
                id: created.id,
                code: created.code,
                name: "Test Locale",
              })
            )
          })

          it("should throw when retrieving non-existent locale", async () => {
            const error = await service
              .retrieveLocale("non-existent-id")
              .catch((e) => e)

            expect(error.message).toContain("Locale with id: non-existent-id")
          })
        })

        describe("listing locales", () => {
          it("should list all locales including defaults", async () => {
            const locales = await service.listLocales()

            expect(locales.length).toBeGreaterThanOrEqual(45)
          })

          it("should filter locales by code", async () => {
            await service.createLocales(createLocaleFixture)
            const locales = await service.listLocales({ code: "test-LC" })

            expect(locales).toHaveLength(1)
            expect(locales[0].code).toEqual("test-LC")
          })

          it("should filter locales by name", async () => {
            const locales = await service.listLocales({
              name: "English (United States)",
            })

            expect(locales).toHaveLength(1)
            expect(locales[0].code).toEqual("en-US")
          })

          it("should support pagination", async () => {
            const paginatedLocales = await service.listLocales(
              {},
              { take: 5, skip: 0 }
            )

            expect(paginatedLocales).toHaveLength(5)
          })
        })

        describe("listing and counting locales", () => {
          it("should list and count locales", async () => {
            const [locales, count] = await service.listAndCountLocales()

            expect(count).toBeGreaterThanOrEqual(45)
            expect(locales.length).toEqual(count)
          })

          it("should filter and count correctly", async () => {
            await service.createLocales([
              { code: "custom-A", name: "Custom A" },
              { code: "custom-B", name: "Custom B" },
            ])

            const [locales, count] = await service.listAndCountLocales({
              code: ["custom-A", "custom-B"],
            })

            expect(count).toEqual(2)
            expect(locales).toHaveLength(2)
          })
        })

        describe("updating a locale", () => {
          it("should update a locale successfully", async () => {
            const created = await service.createLocales(createLocaleFixture)
            const updated = await service.updateLocales({
              id: created.id,
              code: created.code,
              name: "Updated Locale Name",
            })

            expect(updated.name).toEqual("Updated Locale Name")
            expect(updated.code).toEqual("test-LC")
          })

          it("should update multiple locales", async () => {
            const created = await service.createLocales([
              { code: "upd-1", name: "Update 1" },
              { code: "upd-2", name: "Update 2" },
            ])

            const updated = await service.updateLocales([
              { id: created[0].id, code: created[0].code, name: "Updated 1" },
              { id: created[1].id, code: created[1].code, name: "Updated 2" },
            ])

            expect(updated).toHaveLength(2)
            const updatedById = updated.reduce(
              (acc, l) => ({ ...acc, [l.code]: l }),
              {} as Record<string, any>
            )
            expect(updatedById[created[0].code].name).toEqual("Updated 1")
            expect(updatedById[created[1].code].name).toEqual("Updated 2")
          })
        })

        describe("deleting a locale", () => {
          it("should delete a locale successfully", async () => {
            const created = await service.createLocales(createLocaleFixture)
            await service.deleteLocales(created.id)

            const error = await service
              .retrieveLocale(created.id)
              .catch((e) => e)

            expect(error.message).toContain("Locale with id")
          })

          it("should delete multiple locales", async () => {
            const created = await service.createLocales([
              { code: "del-1", name: "Delete 1" },
              { code: "del-2", name: "Delete 2" },
            ])

            await service.deleteLocales([created[0].id, created[1].id])

            const locales = await service.listLocales({
              code: ["del-1", "del-2"],
            })

            expect(locales).toHaveLength(0)
          })
        })

        describe("soft deleting a locale", () => {
          it("should soft delete a locale", async () => {
            const created = await service.createLocales(createLocaleFixture)
            await service.softDeleteLocales(created.id)

            const locales = await service.listLocales({ code: created.code })
            expect(locales).toHaveLength(0)
          })
        })

        describe("restoring a locale", () => {
          it("should restore a soft deleted locale", async () => {
            const created = await service.createLocales(createLocaleFixture)
            await service.softDeleteLocales(created.id)
            await service.restoreLocales(created.id)

            const restored = await service.retrieveLocale(created.id)
            expect(restored.code).toEqual(created.code)
          })
        })
      })

      describe("Translation", () => {
        describe("creating a translation", () => {
          it("should create a translation successfully", async () => {
            const translation = await service.createTranslations(
              createTranslationFixture
            )

            expect(translation).toEqual(
              expect.objectContaining({
                id: expect.stringMatching(/^trans_/),
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Titre du produit",
                  description: "Description du produit en français",
                },
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              })
            )
          })

          it("should create multiple translations successfully", async () => {
            const translations = await service.createTranslations([
              createTranslationFixture,
              {
                reference_id: "prod_123",
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Produkttitel",
                  description: "Produktbeschreibung auf Deutsch",
                },
              },
            ])

            expect(translations).toHaveLength(2)
            expect(translations[0].locale_code).toEqual("fr-FR")
            expect(translations[1].locale_code).toEqual("de-DE")
          })

          it("should fail when creating duplicate translation for same entity/type/locale", async () => {
            await service.createTranslations(createTranslationFixture)

            const error = await service
              .createTranslations(createTranslationFixture)
              .catch((e) => e)

            expect(error.message).toMatch(
              /unique|duplicate|constraint|already exists/i
            )
          })
        })

        describe("retrieving a translation", () => {
          it("should retrieve a translation by id", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            const retrieved = await service.retrieveTranslation(created.id)

            expect(retrieved).toEqual(
              expect.objectContaining({
                id: created.id,
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
              })
            )
          })

          it("should throw when retrieving non-existent translation", async () => {
            const error = await service
              .retrieveTranslation("non-existent-id")
              .catch((e) => e)

            expect(error.message).toContain(
              "Translation with id: non-existent-id"
            )
          })
        })

        describe("listing translations", () => {
          beforeEach(async () => {
            await service.createTranslations([
              {
                reference_id: "prod_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Produit Un" },
              },
              {
                reference_id: "prod_1",
                reference: "product",
                locale_code: "de-DE",
                translations: { title: "Produkt Eins" },
              },
              {
                reference_id: "prod_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Produit Deux" },
              },
              {
                reference_id: "cat_1",
                reference: "product_category",
                locale_code: "fr-FR",
                translations: { name: "Catégorie" },
              },
            ])
          })

          it("should list all translations", async () => {
            const translations = await service.listTranslations()

            expect(translations.length).toBeGreaterThanOrEqual(4)
          })

          it("should filter by reference_id", async () => {
            const translations = await service.listTranslations({
              reference_id: "prod_1",
            })

            expect(translations).toHaveLength(2)
          })

          it("should filter by reference", async () => {
            const translations = await service.listTranslations({
              reference: "product_category",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("cat_1")
          })

          it("should filter by locale_code", async () => {
            const translations = await service.listTranslations({
              locale_code: "de-DE",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("prod_1")
          })

          it("should filter by multiple criteria", async () => {
            const translations = await service.listTranslations({
              reference_id: "prod_1",
              locale_code: "fr-FR",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].translations).toEqual({
              title: "Produit Un",
            })
          })

          it("should support pagination", async () => {
            const translations = await service.listTranslations(
              {},
              { take: 2, skip: 0 }
            )

            expect(translations).toHaveLength(2)
          })
        })

        describe("listing translations with q filter (JSONB search)", () => {
          beforeEach(async () => {
            await service.createTranslations([
              {
                reference_id: "prod_search_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Chaussures de sport",
                  description: "Des chaussures confortables pour le running",
                },
              },
              {
                reference_id: "prod_search_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "T-shirt de sport",
                  description: "Un t-shirt léger et respirant",
                },
              },
              {
                reference_id: "prod_search_3",
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Sportschuhe",
                  description: "Bequeme Schuhe zum Laufen",
                },
              },
            ])
          })

          it("should search within JSONB translations field", async () => {
            const translations = await service.listTranslations({
              q: "chaussures",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("prod_search_1")
          })

          it("should search case-insensitively", async () => {
            const translations = await service.listTranslations({
              q: "CHAUSSURES",
            })

            expect(translations).toHaveLength(1)
          })

          it("should search across all JSONB values", async () => {
            const translations = await service.listTranslations({
              q: "running",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("prod_search_1")
          })

          it("should combine q filter with other filters", async () => {
            const translations = await service.listTranslations({
              q: "sport",
              locale_code: "fr-FR",
            })

            expect(translations).toHaveLength(2)
          })

          it("should return empty array when q matches nothing", async () => {
            const translations = await service.listTranslations({
              q: "nonexistent-term-xyz",
            })

            expect(translations).toHaveLength(0)
          })
        })

        describe("listing and counting translations", () => {
          beforeEach(async () => {
            await service.createTranslations([
              {
                reference_id: "cnt_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Un" },
              },
              {
                reference_id: "cnt_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Deux" },
              },
              {
                reference_id: "cnt_3",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Trois" },
              },
            ])
          })

          it("should list and count translations", async () => {
            const [translations, count] =
              await service.listAndCountTranslations({
                reference: "product",
                locale_code: "fr-FR",
              })

            expect(count).toEqual(3)
            expect(translations).toHaveLength(3)
          })

          it("should list and count with q filter", async () => {
            const [translations, count] =
              await service.listAndCountTranslations({
                q: "Deux",
              })

            expect(count).toEqual(1)
            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("cnt_2")
          })
        })

        describe("updating a translation", () => {
          it("should update a translation successfully", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            const updated = await service.updateTranslations({
              id: created.id,
              translations: {
                title: "Nouveau titre",
                description: "Nouvelle description",
              },
            })

            expect(updated.translations).toEqual({
              title: "Nouveau titre",
              description: "Nouvelle description",
            })
          })

          it("should update multiple translations", async () => {
            const created = await service.createTranslations([
              {
                reference_id: "upd_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Original 1" },
              },
              {
                reference_id: "upd_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Original 2" },
              },
            ])

            const updated = await service.updateTranslations([
              { id: created[0].id, translations: { title: "Updated 1" } },
              { id: created[1].id, translations: { title: "Updated 2" } },
            ])

            expect(updated).toHaveLength(2)
            const updatedById = updated.reduce(
              (acc, t) => ({ ...acc, [t.id]: t }),
              {} as Record<string, any>
            )
            expect(updatedById[created[0].id].translations).toEqual({
              title: "Updated 1",
            })
            expect(updatedById[created[1].id].translations).toEqual({
              title: "Updated 2",
            })
          })
        })

        describe("deleting a translation", () => {
          it("should delete a translation successfully", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            await service.deleteTranslations(created.id)

            const error = await service
              .retrieveTranslation(created.id)
              .catch((e) => e)

            expect(error.message).toContain("Translation with id")
          })

          it("should delete multiple translations", async () => {
            const created = await service.createTranslations([
              {
                reference_id: "del_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Delete 1" },
              },
              {
                reference_id: "del_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Delete 2" },
              },
            ])

            await service.deleteTranslations([created[0].id, created[1].id])

            const translations = await service.listTranslations({
              reference_id: ["del_1", "del_2"],
            })

            expect(translations).toHaveLength(0)
          })
        })

        describe("soft deleting a translation", () => {
          it("should soft delete a translation", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            await service.softDeleteTranslations(created.id)

            const translations = await service.listTranslations({
              id: created.id,
            })
            expect(translations).toHaveLength(0)
          })
        })

        describe("restoring a translation", () => {
          it("should restore a soft deleted translation", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            await service.softDeleteTranslations(created.id)
            await service.restoreTranslations(created.id)

            const restored = await service.retrieveTranslation(created.id)
            expect(restored.id).toEqual(created.id)
          })
        })
      })
    })
  },
})
