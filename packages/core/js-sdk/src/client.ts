import qs from "qs"
import { events } from "fetch-event-stream"
import {
  ClientFetch,
  Config,
  FetchArgs,
  FetchInput,
  FetchStreamResponse,
  Logger,
} from "./types"

export const PUBLISHABLE_KEY_HEADER = "x-publishable-api-key"

const hasStorage = (storage: "localStorage" | "sessionStorage") => {
  if (typeof window !== "undefined") {
    return storage in window
  }

  return false
}

const toBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    return window.btoa(str)
  }

  return Buffer.from(str).toString("base64")
}

const sanitizeHeaders = (headers: Headers) => {
  return {
    ...Object.fromEntries(headers.entries()),
    authorization: "<REDACTED>",
  }
}

const normalizeRequest = (
  init: FetchArgs | undefined,
  headers: Headers,
  config: Config
): RequestInit | undefined => {
  let body = init?.body
  if (body && headers.get("content-type")?.includes("application/json")) {
    body = JSON.stringify(body)
  }

  return {
    ...init,
    headers,
    // TODO: Setting this to "include" poses some security risks, as it will send cookies to any domain. We should consider making this configurable.
    credentials: config.auth?.type === "session" ? "include" : "omit",
    ...(body ? { body: body as RequestInit["body"] } : {}),
  } as RequestInit
}

const normalizeResponse = async (resp: Response, reqHeaders: Headers) => {
  if (resp.status >= 300) {
    const jsonError = (await resp.json().catch(() => ({}))) as {
      message?: string
    }
    throw new FetchError(
      jsonError.message ?? resp.statusText,
      resp.statusText,
      resp.status
    )
  }

  // If we requested JSON, we try to parse the response. Otherwise, we return the raw response.
  const isJsonRequest = reqHeaders.get("accept")?.includes("application/json")
  return isJsonRequest ? await resp.json() : resp
}

export class FetchError extends Error {
  status: number | undefined
  statusText: string | undefined

  constructor(message: string, statusText?: string, status?: number) {
    super(message)
    this.statusText = statusText
    this.status = status
  }
}

export class Client {
  public fetch_: ClientFetch
  private config: Config
  private logger: Logger

  private DEFAULT_JWT_STORAGE_KEY = "medusa_auth_token"
  private token = ""

  constructor(config: Config) {
    this.config = config
    const logger = config.logger || {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    }

    this.logger = {
      ...logger,
      debug: config.debug ? logger.debug : () => {},
    }

    this.fetch_ = this.initClient()
  }

  /**
   * `fetch` closely follows (and uses under the hood) the native `fetch` API. There are, however, few key differences:
   * - Non 2xx statuses throw a `FetchError` with the status code as the `status` property, rather than resolving the promise
   * - You can pass `body` and `query` as objects, and they will be encoded and stringified.
   * - The response gets parsed as JSON if the `accept` header is set to `application/json`, otherwise the raw Response object is returned
   *
   * Since the response is dynamically determined, we cannot know if it is JSON or not. Therefore, it is important to pass `Response` as the return type
   *
   * @param input: FetchInput
   * @param init: FetchArgs
   * @returns Promise<T>
   */
  fetch<T extends any>(input: FetchInput, init?: FetchArgs): Promise<T> {
    return this.fetch_(input, init) as unknown as Promise<T>
  }

  /**
   * `fetchStream` is a helper method to deal with server-sent events. It returns an object with a stream and an abort function.
   * It follows a very similar interface to `fetch`, with the return value being an async generator.
   * The stream is an async generator that yields `ServerSentEventMessage` objects, which contains the event name, stringified data, and few other properties.
   * The caller is responsible for handling `disconnect` events and aborting the stream. The caller is also responsible for parsing the data field.
   *
   * @param input: FetchInput
   * @param init: FetchArgs
   * @returns FetchStreamResponse
   */
  async fetchStream(
    input: FetchInput,
    init?: FetchArgs
  ): Promise<FetchStreamResponse> {
    let abort = new AbortController()

    let res = await this.fetch_(input, {
      ...init,
      signal: abort.signal,
      headers: { ...init?.headers, accept: "text/event-stream" },
    })

    if (res.ok) {
      return { stream: events(res, abort.signal), abort: abort.abort }
    }

    return { stream: null, abort: abort.abort }
  }

  setToken(token: string) {
    this.setToken_(token)
  }

  clearToken() {
    this.clearToken_()
  }

  protected clearToken_() {
    const { storageMethod, storageKey } = this.getTokenStorageInfo_()
    switch (storageMethod) {
      case "local": {
        window.localStorage.removeItem(storageKey)
        break
      }
      case "session": {
        window.sessionStorage.removeItem(storageKey)
        break
      }
      case "memory": {
        this.token = ""
        break
      }
    }
  }

  protected initClient(): ClientFetch {
    const defaultHeaders = new Headers({
      "content-type": "application/json",
      accept: "application/json",
      ...this.getApiKeyHeader_(),
      ...this.getPublishableKeyHeader_(),
    })

    this.logger.debug(
      "Initiating Medusa client with default headers:\n",
      `${JSON.stringify(sanitizeHeaders(defaultHeaders), null, 2)}\n`
    )

    return async (input: FetchInput, init?: FetchArgs) => {
      // We always want to fetch the up-to-date JWT token before firing off a request.
      const headers = new Headers(defaultHeaders)
      const customHeaders = {
        ...this.config.globalHeaders,
        ...this.getJwtHeader_(),
        ...init?.headers,
      }
      // We use `headers.set` in order to ensure headers are overwritten in a case-insensitive manner.
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (value === null) {
          headers.delete(key)
        } else {
          headers.set(key, value)
        }
      })

      let normalizedInput: RequestInfo | URL = input
      if (input instanceof URL || typeof input === "string") {
        normalizedInput = new URL(input, this.config.baseUrl)
        if (init?.query) {
          const params = Object.fromEntries(
            normalizedInput.searchParams.entries()
          )
          const stringifiedQuery = qs.stringify({ ...params, ...init.query })
          normalizedInput.search = stringifiedQuery
        }
      }

      this.logger.debug(
        "Performing request to:\n",
        `URL: ${normalizedInput.toString()}\n`,
        `Headers: ${JSON.stringify(sanitizeHeaders(headers), null, 2)}\n`
      )

      // Any non-request errors (eg. invalid JSON in the response) will be thrown as-is.
      return await fetch(
        normalizedInput,
        normalizeRequest(init, headers, this.config)
      ).then((resp) => {
        this.logger.debug(`Received response with status ${resp.status}\n`)
        return normalizeResponse(resp, headers)
      })
    }
  }

  protected getApiKeyHeader_ = (): { Authorization: string } | {} => {
    return this.config.apiKey
      ? { Authorization: "Basic " + toBase64(this.config.apiKey + ":") }
      : {}
  }

  protected getPublishableKeyHeader_ = ():
    | { [PUBLISHABLE_KEY_HEADER]: string }
    | {} => {
    return this.config.publishableKey
      ? { [PUBLISHABLE_KEY_HEADER]: this.config.publishableKey }
      : {}
  }

  protected getJwtHeader_ = (): { Authorization: string } | {} => {
    // If the user has requested for session storage, we don't want to send the JWT token in the header.
    if (this.config.auth?.type === "session") {
      return {}
    }

    const token = this.getToken_()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  protected setToken_ = (token: string) => {
    const { storageMethod, storageKey } = this.getTokenStorageInfo_()
    switch (storageMethod) {
      case "local": {
        window.localStorage.setItem(storageKey, token)
        break
      }
      case "session": {
        window.sessionStorage.setItem(storageKey, token)
        break
      }
      case "memory": {
        this.token = token
        break
      }
    }
  }

  protected getToken_ = () => {
    const { storageMethod, storageKey } = this.getTokenStorageInfo_()
    switch (storageMethod) {
      case "local": {
        return window.localStorage.getItem(storageKey)
      }
      case "session": {
        return window.sessionStorage.getItem(storageKey)
      }
      case "memory": {
        return this.token
      }
    }

    return
  }

  protected getTokenStorageInfo_ = () => {
    const hasLocal = hasStorage("localStorage")
    const hasSession = hasStorage("sessionStorage")

    const storageMethod =
      this.config.auth?.jwtTokenStorageMethod || (hasLocal ? "local" : "memory")
    const storageKey =
      this.config.auth?.jwtTokenStorageKey || this.DEFAULT_JWT_STORAGE_KEY

    if (!hasLocal && storageMethod === "local") {
      throw new Error("Local JWT storage is only available in the browser")
    }
    if (!hasSession && storageMethod === "session") {
      throw new Error("Session JWT storage is only available in the browser")
    }

    return {
      storageMethod,
      storageKey,
    }
  }
}
