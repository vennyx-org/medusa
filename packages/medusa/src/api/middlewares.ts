import { defineMiddlewares } from "../utils/define-middlewares"
import { adminApiKeyRoutesMiddlewares } from "./admin/api-keys/middlewares"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminClaimRoutesMiddlewares } from "./admin/claims/middlewares"
import { adminCollectionRoutesMiddlewares } from "./admin/collections/middlewares"
import { adminCurrencyRoutesMiddlewares } from "./admin/currencies/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminDraftOrderRoutesMiddlewares } from "./admin/draft-orders/middlewares"
import { adminExchangeRoutesMiddlewares } from "./admin/exchanges/middlewares"
import { adminFulfillmentProvidersRoutesMiddlewares } from "./admin/fulfillment-providers/middlewares"
import { adminFulfillmentSetsRoutesMiddlewares } from "./admin/fulfillment-sets/middlewares"
import { adminFulfillmentsRoutesMiddlewares } from "./admin/fulfillments/middlewares"
import { adminInventoryRoutesMiddlewares } from "./admin/inventory-items/middlewares"
import { adminInviteRoutesMiddlewares } from "./admin/invites/middlewares"
import { adminNotificationRoutesMiddlewares } from "./admin/notifications/middlewares"
import { adminOrderEditRoutesMiddlewares } from "./admin/order-edits/middlewares"
import { adminOrderRoutesMiddlewares } from "./admin/orders/middlewares"
import { adminPaymentCollectionsMiddlewares } from "./admin/payment-collections/middlewares"
import { adminPaymentRoutesMiddlewares } from "./admin/payments/middlewares"
import { adminPriceListsRoutesMiddlewares } from "./admin/price-lists/middlewares"
import { adminPricePreferencesRoutesMiddlewares } from "./admin/price-preferences/middlewares"
import { adminProductCategoryRoutesMiddlewares } from "./admin/product-categories/middlewares"
import { adminProductTagRoutesMiddlewares } from "./admin/product-tags/middlewares"
import { adminProductTypeRoutesMiddlewares } from "./admin/product-types/middlewares"
import { adminProductVariantRoutesMiddlewares } from "./admin/product-variants/middlewares"
import { adminProductRoutesMiddlewares } from "./admin/products/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"
import { adminRefundReasonsRoutesMiddlewares } from "./admin/refund-reasons/middlewares"
import { adminRegionRoutesMiddlewares } from "./admin/regions/middlewares"
import { adminReservationRoutesMiddlewares } from "./admin/reservations/middlewares"
import { adminReturnReasonRoutesMiddlewares } from "./admin/return-reasons/middlewares"
import { adminReturnRoutesMiddlewares } from "./admin/returns/middlewares"
import { adminSalesChannelRoutesMiddlewares } from "./admin/sales-channels/middlewares"
import { adminShippingOptionRoutesMiddlewares } from "./admin/shipping-options/middlewares"
import { adminShippingProfilesMiddlewares } from "./admin/shipping-profiles/middlewares"
import { adminStockLocationRoutesMiddlewares } from "./admin/stock-locations/middlewares"
import { adminStoreRoutesMiddlewares } from "./admin/stores/middlewares"
import { adminTaxRateRoutesMiddlewares } from "./admin/tax-rates/middlewares"
import { adminTaxRegionRoutesMiddlewares } from "./admin/tax-regions/middlewares"
import { adminUploadRoutesMiddlewares } from "./admin/uploads/middlewares"
import { adminUserRoutesMiddlewares } from "./admin/users/middlewares"
import { adminWorkflowsExecutionsMiddlewares } from "./admin/workflows-executions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"

import { hooksRoutesMiddlewares } from "./hooks/middlewares"
import { storeCartRoutesMiddlewares } from "./store/carts/middlewares"
import { storeCollectionRoutesMiddlewares } from "./store/collections/middlewares"
import { storeCurrencyRoutesMiddlewares } from "./store/currencies/middlewares"
import { storeCustomerRoutesMiddlewares } from "./store/customers/middlewares"
import { storeRoutesMiddlewares } from "./store/middlewares"
import { storeOrderRoutesMiddlewares } from "./store/orders/middlewares"
import { storePaymentCollectionsMiddlewares } from "./store/payment-collections/middlewares"
import { storePaymentProvidersMiddlewares } from "./store/payment-providers/middlewares"
import { storeProductCategoryRoutesMiddlewares } from "./store/product-categories/middlewares"
import { storeProductRoutesMiddlewares } from "./store/products/middlewares"
import { storeRegionRoutesMiddlewares } from "./store/regions/middlewares"
import { storeReturnReasonRoutesMiddlewares } from "./store/return-reasons/middlewares"
import { storeShippingOptionRoutesMiddlewares } from "./store/shipping-options/middlewares"

export default defineMiddlewares([
  ...storeRoutesMiddlewares,
  ...adminCustomerGroupRoutesMiddlewares,
  ...adminCustomerRoutesMiddlewares,
  ...adminPromotionRoutesMiddlewares,
  ...adminCampaignRoutesMiddlewares,
  ...storeCartRoutesMiddlewares,
  ...storeCustomerRoutesMiddlewares,
  ...storeCartRoutesMiddlewares,
  ...storeCollectionRoutesMiddlewares,
  ...storeProductCategoryRoutesMiddlewares,
  ...storePaymentProvidersMiddlewares,
  ...storeShippingOptionRoutesMiddlewares,
  ...storePaymentCollectionsMiddlewares,
  ...storeOrderRoutesMiddlewares,
  ...authRoutesMiddlewares,
  ...adminWorkflowsExecutionsMiddlewares,
  ...adminReturnRoutesMiddlewares,
  ...storeRegionRoutesMiddlewares,
  ...adminRegionRoutesMiddlewares,
  ...adminReturnRoutesMiddlewares,
  ...adminUserRoutesMiddlewares,
  ...adminInviteRoutesMiddlewares,
  ...adminTaxRateRoutesMiddlewares,
  ...adminTaxRegionRoutesMiddlewares,
  ...adminApiKeyRoutesMiddlewares,
  ...hooksRoutesMiddlewares,
  ...adminStoreRoutesMiddlewares,
  ...adminCurrencyRoutesMiddlewares,
  ...storeCurrencyRoutesMiddlewares,
  ...adminProductRoutesMiddlewares,
  ...adminPaymentRoutesMiddlewares,
  ...adminPriceListsRoutesMiddlewares,
  ...adminPricePreferencesRoutesMiddlewares,
  ...adminInventoryRoutesMiddlewares,
  ...adminCollectionRoutesMiddlewares,
  ...adminShippingOptionRoutesMiddlewares,
  ...adminDraftOrderRoutesMiddlewares,
  ...adminSalesChannelRoutesMiddlewares,
  ...adminStockLocationRoutesMiddlewares,
  ...adminProductTypeRoutesMiddlewares,
  ...adminProductTagRoutesMiddlewares,
  ...adminUploadRoutesMiddlewares,
  ...adminFulfillmentSetsRoutesMiddlewares,
  ...adminNotificationRoutesMiddlewares,
  ...adminOrderRoutesMiddlewares,
  ...adminReservationRoutesMiddlewares,
  ...adminProductCategoryRoutesMiddlewares,
  ...adminShippingProfilesMiddlewares,
  ...adminFulfillmentsRoutesMiddlewares,
  ...adminFulfillmentProvidersRoutesMiddlewares,
  ...storeProductRoutesMiddlewares,
  ...storeReturnReasonRoutesMiddlewares,
  ...adminReturnReasonRoutesMiddlewares,
  ...adminClaimRoutesMiddlewares,
  ...adminRefundReasonsRoutesMiddlewares,
  ...adminExchangeRoutesMiddlewares,
  ...adminProductVariantRoutesMiddlewares,
  ...adminOrderEditRoutesMiddlewares,
  ...adminPaymentCollectionsMiddlewares,
])
