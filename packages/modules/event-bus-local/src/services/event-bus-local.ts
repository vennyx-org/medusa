import {
  Event,
  EventBusTypes,
  Logger,
  MedusaContainer,
  Message,
  Subscriber,
} from "@medusajs/framework/types"
import { AbstractEventBusModuleService } from "@medusajs/framework/utils"
import { EventEmitter } from "events"
import { ulid } from "ulid"

type InjectedDependencies = {
  logger: Logger
}

type StagingQueueType = Map<string, Message[]>

const eventEmitter = new EventEmitter()
eventEmitter.setMaxListeners(Infinity)

// eslint-disable-next-line max-len
export default class LocalEventBusService extends AbstractEventBusModuleService {
  protected readonly logger_?: Logger
  protected readonly eventEmitter_: EventEmitter
  protected groupedEventsMap_: StagingQueueType

  constructor({ logger }: MedusaContainer & InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.logger_ = logger
    this.eventEmitter_ = eventEmitter
    this.groupedEventsMap_ = new Map()
  }

  /**
   * Accept an event name and some options
   *
   * @param eventsData
   * @param options The options can include `internal` which will prevent the event from being logged
   */
  async emit<T = unknown>(
    eventsData: Message<T> | Message<T>[],
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const normalizedEventsData = Array.isArray(eventsData)
      ? eventsData
      : [eventsData]

    for (const eventData of normalizedEventsData) {
      const eventListenersCount = this.eventEmitter_.listenerCount(
        eventData.name
      )

      if (!options.internal && !eventData.options?.internal) {
        this.logger_?.info(
          `Processing ${eventData.name} which has ${eventListenersCount} subscribers`
        )
      }

      if (eventListenersCount === 0) {
        continue
      }

      await this.groupOrEmitEvent(eventData)
    }
  }

  // If the data of the event consists of a eventGroupId, we don't emit the event, instead
  // we add them to a queue grouped by the eventGroupId and release them when
  // explicitly requested.
  // This is useful in the event of a distributed transaction where you'd want to emit
  // events only once the transaction ends.
  private async groupOrEmitEvent<T = unknown>(eventData: Message<T>) {
    const { options, ...eventBody } = eventData
    const eventGroupId = eventBody.metadata?.eventGroupId

    if (eventGroupId) {
      await this.groupEvent(eventGroupId, eventData)
    } else {
      const { options, ...eventBody } = eventData
      this.eventEmitter_.emit(eventData.name, eventBody)
    }
  }

  // Groups an event to a queue to be emitted upon explicit release
  private async groupEvent<T = unknown>(
    eventGroupId: string,
    eventData: Message<T>
  ) {
    const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []

    groupedEvents.push(eventData)

    this.groupedEventsMap_.set(eventGroupId, groupedEvents)
  }

  async releaseGroupedEvents(eventGroupId: string) {
    const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []

    for (const event of groupedEvents) {
      const { options, ...eventBody } = event

      this.eventEmitter_.emit(event.name, eventBody)
    }

    await this.clearGroupedEvents(eventGroupId)
  }

  async clearGroupedEvents(eventGroupId: string) {
    this.groupedEventsMap_.delete(eventGroupId)
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    const randId = ulid()
    this.storeSubscribers({ event, subscriberId: randId, subscriber })
    this.eventEmitter_.on(event, async (data: Event) => {
      try {
        await subscriber(data)
      } catch (e) {
        this.logger_?.error(
          `An error occurred while processing ${event.toString()}: ${e}`
        )
      }
    })
    return this
  }

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    const existingSubscribers = this.eventToSubscribersMap_.get(event)

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.id === context?.subscriberId
      )

      if (subIndex !== -1) {
        this.eventToSubscribersMap_.get(event)?.splice(subIndex as number, 1)
      }
    }

    this.eventEmitter_.off(event, subscriber)
    return this
  }
}
