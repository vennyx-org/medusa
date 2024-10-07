import { model } from "@medusajs/framework/utils"
import { Notification } from "./notification"

export const NotificationProvider = model.define("notificationProvider", {
  id: model.id({ prefix: "notpro" }).primaryKey(),
  handle: model.text(),
  name: model.text(),
  is_enabled: model.boolean().default(true),
  channels: model.array().default([]),
  notifications: model.hasMany(() => Notification, { mappedBy: "provider" }),
})
