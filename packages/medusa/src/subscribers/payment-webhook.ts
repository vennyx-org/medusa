import {
  IPaymentModuleService,
  ProviderWebhookPayload,
} from "@medusajs/framework/types"
import { Modules, PaymentWebhookEvents } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

type SerializedBuffer = {
  data: ArrayBuffer
  type: "Buffer"
}

export default async function paymentWebhookhandler({
  event,
  container,
}: SubscriberArgs<ProviderWebhookPayload>) {
  const paymentService: IPaymentModuleService = container.resolve(
    Modules.PAYMENT
  )

  const input = event.data

  if (
    (input.payload.rawData as unknown as SerializedBuffer).type === "Buffer"
  ) {
    input.payload.rawData = Buffer.from(
      (input.payload.rawData as unknown as SerializedBuffer).data
    )
  }
  await paymentService.processEvent(input)
}

export const config: SubscriberConfig = {
  event: PaymentWebhookEvents.WebhookReceived,
  context: {
    subscriberId: "payment-webhook-handler",
  },
}
