<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/tax
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

Tax Module for Medusa: manages tax regions, tax rates, tax rate rules, and tax providers, and calculates tax lines for carts and orders. Tax calculation is delegated to Tax Module Providers: the built-in `system` provider (`tp_system`) is always available, and you can register custom or third-party providers (for example, to integrate a tax service) through the module's `providers` option. It's installed and registered by default with `@medusajs/medusa`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/tax` |
| Type | Commerce Module |
| Module key | `Modules.TAX` (`"tax"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/tax` |

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by `defineConfig`.

## Usage

To register a custom tax provider, add it to the module's `providers` option in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/tax",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-tax-provider",
            id: "my-provider",
          },
        ],
      },
    },
  ],
})
```

The registered provider's ID has the format `tp_{identifier}_{id}`, where `identifier` is the provider class's static `identifier` property and `id` is the `id` set above. Assign it to a tax region to use it for that region's tax calculations.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id?: string, options?: Record<string, unknown> }[]` | Tax Module Providers to register in addition to the built-in `system` provider. | `[]` |

## Resources

- [Tax Module](https://docs.medusajs.com/resources/commerce-modules/tax)
- [Tax Module Provider](https://docs.medusajs.com/resources/commerce-modules/tax/tax-provider)
- [Module Options](https://docs.medusajs.com/resources/commerce-modules/tax/module-options)
- [Tax Calculation with the Tax Provider](https://docs.medusajs.com/resources/commerce-modules/tax/tax-calculation-with-provider)
- [Tax Rates and Rules](https://docs.medusajs.com/resources/commerce-modules/tax/tax-rates-and-rules)
- [Tax Region](https://docs.medusajs.com/resources/commerce-modules/tax/tax-region)
# Tax Module

## Enhanced Tax Features

### Price Threshold-based Taxation

This module now supports price threshold-based taxation, which allows you to apply different tax rates based on the unit price of products. This is particularly useful for tax systems where higher tax rates may apply to products above certain price thresholds.

#### Creating Price Threshold Rules

To create a price threshold rule:

```js
await taxModuleService.createTaxRateRules({
  tax_rate_id: "txr_123",
  reference: "price_threshold",
  reference_id: "luxury_goods",
  min_price: 1000000, // 1,000,000 price threshold
  max_price: null, // No upper limit
})
```

You can create multiple threshold ranges by setting different `min_price` and `max_price` values.

#### BigNumber Support

The price threshold feature fully supports Medusa's BigNumber values, making it suitable for currencies requiring high precision or large numbers (like Turkish Lira). The system will correctly compare product prices with threshold values without precision loss.

### Compound Tax Calculation

In some tax systems (like Turkey's), taxes are calculated on top of other taxes. For example, VAT (KDV) is calculated on a price that already includes Special Consumption Tax (ÖTV). The `is_compound` flag enables this behavior.

When a tax rate is marked with `is_compound: true`:
- It will be calculated after non-compound taxes
- Its calculation will be based on the price plus all non-compound taxes
- This ensures proper tax-on-tax calculation for systems like Turkey's

#### Setting Up Compound Taxes

```js
// Create a tax region
const region = await taxModuleService.createTaxRegions({
  country_code: "tr",
});

// Create first non-compound tax (Special Consumption Tax)
const sctTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "SCT",
  name: "Special Consumption Tax",
  rate: 10, // 10%
  is_combinable: true, 
  is_compound: false, // Apply this tax to the base price
});

// Create a compound tax (VAT)
const vatTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "VAT",
  name: "Value Added Tax",
  rate: 18, // 18%
  is_combinable: true,
  is_compound: true, // Apply this tax to (price + SCT)
});
```

With this setup:
- A product costing 1000 TL will have:
  - 10% SCT = 100 TL (calculated on 1000 TL)
  - 18% VAT = 198 TL (calculated on 1100 TL)
  - Total tax = 298 TL
  - Final price = 1298 TL

#### Countries with Similar Compound Tax Systems

The compound tax feature supports various international tax systems similar to Turkey's model:

- **Brazil** - IPI (Industrial Product Tax) is applied first, then ICMS (state VAT) is calculated on the price including IPI
- **Philippines** - Excise taxes apply first, then VAT is calculated on the price including excise tax
- **Russia** - Excise duties apply first, then VAT is calculated on the price including these duties
- **India** - For luxury goods, additional cess tax applies on top of GST
- **Mexico** - IEPS (Special Tax) applies first to certain goods, then VAT is calculated on the price including IEPS
- **South Africa** - Excise duties on items like alcohol are applied first, then VAT is calculated on the price including duties

### Combinable Tax Rates Without Parent-Child Regions

The enhanced tax module now supports applying multiple tax rates within a single region without requiring parent-child region relationships.

#### Setting Up Combinable Tax Rates

```js
// Create a tax region
const region = await taxModuleService.createTaxRegions({
  country_code: "tr",
});

// Create a higher SCT rate with price threshold for luxury goods
const luxurySctTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "LUX-SCT",
  name: "Luxury Special Consumption Tax",
  rate: 40, // 40% SCT for luxury goods
  is_combinable: true,
  is_compound: false,
});

// Add price threshold rule for luxury SCT
await taxModuleService.createTaxRateRules({
  tax_rate_id: luxurySctTaxRate.id,
  reference: "price_threshold",
  reference_id: "luxury_threshold",
  min_price: 1000000, // Applies to products costing 1,000,000 or more
});

// Create VAT as compound tax
const vatTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "VAT",
  name: "Value Added Tax",
  rate: 18, // 18% VAT
  is_combinable: true,
  is_compound: true, // Apply after SCT
});
```

With this setup:
- Products under 1,000,000 TL: Only 18% VAT applies
- Products above 1,000,000 TL: 40% SCT + 18% VAT (on price+SCT) apply
- All works within a single region
