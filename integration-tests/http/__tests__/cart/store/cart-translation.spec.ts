import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { MedusaContainer } from "@medusajs/types"

jest.setTimeout(100000)

process.env.MEDUSA_FF_TRANSLATION = "true"

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

const shippingAddressData = {
  address_1: "test address 1",
  address_2: "test address 2",
  city: "SF",
  country_code: "US",
  province: "CA",
  postal_code: "94016",
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Cart Translation API", () => {
      let appContainer: MedusaContainer
      let storeHeaders: { headers: { [key: string]: string } }
      let region: { id: string }
      let product: { id: string; variants: { id: string; title: string }[] }
      let salesChannel: { id: string }
      let shippingProfile: { id: string }

      beforeAll(async () => {
        appContainer = getContainer()
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

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

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        // Create product with description for translation
        product = (
          await api.post(
            "/admin/products",
            {
              title: "Medusa T-Shirt",
              description: "A comfortable cotton t-shirt",
              handle: "t-shirt",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [
                {
                  title: "Size",
                  values: ["S", "M"],
                },
              ],
              variants: [
                {
                  title: "Small",
                  sku: "SHIRT-S",
                  options: { Size: "S" },
                  manage_inventory: false,
                  prices: [{ amount: 1500, currency_code: "usd" }],
                },
                {
                  title: "Medium",
                  sku: "SHIRT-M",
                  options: { Size: "M" },
                  manage_inventory: false,
                  prices: [{ amount: 1500, currency_code: "usd" }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        // Maintain predictable variants order
        const variantSmall = product.variants.find((v) => v.title === "Small")
        const variantMedium = product.variants.find((v) => v.title === "Medium")
        product.variants = [variantSmall!, variantMedium!]

        // Create translations for product and variants
        await api.post(
          "/admin/translations/batch",
          {
            create: [
              {
                reference_id: product.id,
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "T-Shirt Medusa",
                  description: "Un t-shirt en coton confortable",
                },
              },
              {
                reference_id: product.id,
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Medusa T-Shirt DE",
                  description: "Ein bequemes Baumwoll-T-Shirt",
                },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: {
                  title: "Petit",
                },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: {
                  title: "Klein",
                },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: {
                  title: "Moyen",
                },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: {
                  title: "Mittel",
                },
              },
            ],
          },
          adminHeaders
        )
      })

      describe("POST /store/carts (create cart with locale)", () => {
        it("should create a cart with translated items when locale is provided", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  product_title: "T-Shirt Medusa",
                  product_description: "Un t-shirt en coton confortable",
                  variant_title: "Petit",
                }),
              ]),
            })
          )
        })

        it("should create a cart with original values when no locale is provided", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              product_description: "A comfortable cotton t-shirt",
              variant_title: "Small",
            })
          )
        })
      })

      describe("POST /store/carts/:id/line-items (add items to cart)", () => {
        it("should translate new items using the cart's locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const addItemResponse = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(addItemResponse.status).toEqual(200)
          expect(addItemResponse.data.cart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              product_description: "Un t-shirt en coton confortable",
              variant_title: "Petit",
            })
          )
        })

        it("should translate multiple items added to cart", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          const response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[1].id,
              quantity: 2,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items).toHaveLength(2)

          const smallItem = response.data.cart.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          const mediumItem = response.data.cart.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(smallItem).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Petit",
            })
          )
          expect(mediumItem).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Moyen",
            })
          )
        })
      })

      describe("POST /store/carts/:id (update cart locale)", () => {
        it("should re-translate all items when locale is updated", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [
                { variant_id: product.variants[0].id, quantity: 1 },
                { variant_id: product.variants[1].id, quantity: 1 },
              ],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const frenchSmallItem = cart.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          expect(frenchSmallItem.variant_title).toEqual("Petit")

          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "de-DE",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          const updatedCart = updatedCartResponse.data.cart

          const germanSmallItem = updatedCart.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          const germanMediumItem = updatedCart.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(germanSmallItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              product_description: "Ein bequemes Baumwoll-T-Shirt",
              variant_title: "Klein",
            })
          )
          expect(germanMediumItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              variant_title: "Mittel",
            })
          )
        })

        it("should not re-translate items when locale is not changed", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              email: "test@example.com",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          const updatedCart = updatedCartResponse.data.cart
          expect(updatedCart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Petit",
            })
          )
        })

        it("should handle updating to a locale with no translations", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "ja-JP",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          // Fetch updated cart - should have original values since no Japanese translation exists
          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          // no translation means it will revert to default values
          const updatedCart = updatedCartResponse.data.cart
          expect(updatedCart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              variant_title: "Small",
            })
          )
        })
      })

      describe("Cart with items and locale changes", () => {
        it("should maintain translations when adding items to a cart with existing locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const addResponse = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[1].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(addResponse.data.cart.items).toHaveLength(2)

          const allItemsTranslated = addResponse.data.cart.items.every(
            (item) => item.product_title === "T-Shirt Medusa"
          )
          expect(allItemsTranslated).toBe(true)
        })
      })
    })
  },
})
