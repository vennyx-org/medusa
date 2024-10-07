import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  ProductEvents,
} from "@medusajs/framework/utils"

export const eventBuilders = {
  createdProduct: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  updatedProduct: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  deletedProduct: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  createdProductVariant: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  updatedProductVariant: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  deletedProductVariant: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  createdProductOption: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  updatedProductOption: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  deletedProductOption: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  createdProductType: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  updatedProductType: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  deletedProductType: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  createdProductTag: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  updatedProductTag: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  deletedProductTag: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  createdProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_category",
    eventsEnum: ProductEvents,
  }),
  updatedProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_category",
    eventsEnum: ProductEvents,
  }),
  deletedProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_category",
    eventsEnum: ProductEvents,
  }),
}
