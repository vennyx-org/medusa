import { INotificationProvider, NotificationTypes } from "@medusajs/types"

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the module's options using the second parameter.
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * ```ts
 * import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
 * import { Logger } from "@medusajs/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   apiKey: string
 * }
 *
 * class MyNotificationProviderService extends AbstractNotificationProviderService {
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     super()
 *
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 * }
 *
 * export default MyNotificationProviderService
 * ```
 */
export class AbstractNotificationProviderService
  implements INotificationProvider
{
  /**
   * Override this static method in order for the loader to validate the options provided to the module provider.
   * @param options
   */
  static validateOptions(options: Record<any, any>): void | never {}

  /**
   * This method is used to send a notification using the third-party provider or your custom logic.
   *
   * @param {NotificationTypes.ProviderSendNotificationDTO} notification - The details of the
   * notification to send.
   * @returns {Promise<NotificationTypes.ProviderSendNotificationResultsDTO>} The result of sending
   * the notification.
   *
   * @example
   * // other imports...
   * import {
   *   ProviderSendNotificationDTO,
   *   ProviderSendNotificationResultsDTO
   * } from "@medusajs/framework/types"
   *
   * class MyNotificationProviderService extends AbstractNotificationProviderService {
   *   // ...
   *   async send(
   *     notification: ProviderSendNotificationDTO
   *   ): Promise<ProviderSendNotificationResultsDTO> {
   *     // TODO send the notification using a third-party
   *     // provider or custom logic.
   *     // for example:
   *     return this.client.send({
   *       email: notification.to,
   *       template: notification.template,
   *       template_data: notification.data
   *     })
   *   }
   * }
   */
  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    throw Error(
      `send is not implemented in ${
        Object.getPrototypeOf(this).constructor.name
      }`
    )
  }
}
