import {
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { AdminOrderChangesResponse } from "@medusajs/types/src/http/order/admin/responses"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Order {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
      `/admin/orders/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async retrievePreview(
    id: string,
    query?: HttpTypes.AdminOrderFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderPreviewResponse>(
      `/admin/orders/${id}/preview`,
      {
        query,
        headers,
      }
    )
  }

  async list(
    queryParams?: FindParams & HttpTypes.AdminOrderFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      PaginatedResponse<{ orders: HttpTypes.AdminOrder[] }>
    >(`/admin/orders`, {
      query: queryParams,
      headers,
    })
  }

  async cancel(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
      `/admin/orders/${id}/cancel`,
      {
        method: "POST",
        headers,
      }
    )
  }

  async createFulfillment(
    id: string,
    body: HttpTypes.AdminCreateOrderFulfillment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
      `/admin/orders/${id}/fulfillments`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async cancelFulfillment(
    id: string,
    fulfillmentId: string,
    body: HttpTypes.AdminCancelOrderFulfillment,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
      `/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  async createShipment(
    id: string,
    fulfillmentId: string,
    body: HttpTypes.AdminCreateOrderShipment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
      `/admin/orders/${id}/fulfillments/${fulfillmentId}/shipments`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async markAsDelivered(
    id: string,
    fulfillmentId: string,
    body: HttpTypes.AdminMarkOrderFulfillmentAsDelivered,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
      `/admin/orders/${id}/fulfillments/${fulfillmentId}/mark-as-delivered`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async listChanges(
    id: string,
    queryParams?: FindParams & HttpTypes.AdminOrderChangesFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      PaginatedResponse<AdminOrderChangesResponse>
    >(`/admin/orders/${id}/changes`, {
      query: queryParams,
      headers,
    })
  }
}
