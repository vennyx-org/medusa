import { Modules } from "../../modules-sdk"
import { DEFAULT_STORE_RESTRICTED_FIELDS, defineConfig } from "../define-config"

describe("defineConfig", function () {
  it("should merge empty config with the defaults", function () {
    expect(defineConfig()).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules", function () {
    expect(
      defineConfig({
        modules: {
          GithubModuleService: {
            resolve: "./modules/github",
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "GithubModuleService": {
            "resolve": "./modules/github",
          },
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided", function () {
    expect(
      defineConfig({
        modules: [
          {
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "GithubModuleService": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided with a key to override the module registration name", function () {
    expect(
      defineConfig({
        modules: [
          {
            key: "GithubModuleServiceOverride",
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "GithubModuleServiceOverride": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom project.http config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include disabled modules", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
        modules: {
          [Modules.CART]: false,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "disable": true,
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include cloud-based modules when in cloud execution context", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@medusajs/medusa/cache-redis",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@medusajs/medusa/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@medusajs/medusa/file-s3",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@medusajs/medusa/locking-redis",
                },
              ],
            },
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@medusajs/medusa/workflow-engine-redis",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include cloud-based config with dynamo db", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    process.env.SESSION_STORE = "dynamodb"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@medusajs/medusa/cache-redis",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@medusajs/medusa/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@medusajs/medusa/file-s3",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@medusajs/medusa/locking-redis",
                },
              ],
            },
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@medusajs/medusa/workflow-engine-redis",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {
            "dynamodbOptions": {
              "hashKey": "id",
              "initialized": true,
              "prefix": "sess:",
              "readCapacityUnits": 5,
              "skipThrowMissingSpecialKeys": true,
              "table": "medusa-sessions",
              "writeCapacityUnits": 5,
            },
          },
        },
      }
    `)
  })

  it("should allow overriding cloud-only dynamodb config values via environment variables", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    process.env.SESSION_STORE = "dynamodb"
    process.env.DYNAMO_DB_SESSIONS_CREATE_TABLE = "true"
    process.env.DYNAMO_DB_SESSIONS_HASH_KEY = "user_id"
    process.env.DYNAMO_DB_SESSIONS_PREFIX = "my_session:"
    process.env.DYNAMO_DB_SESSIONS_TABLE = "test-sessions"
    process.env.DYNAMO_DB_SESSIONS_READ_UNITS = "10"
    process.env.DYNAMO_DB_SESSIONS_WRITE_UNITS = "10"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@medusajs/medusa/cache-redis",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@medusajs/medusa/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@medusajs/medusa/file-s3",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@medusajs/medusa/locking-redis",
                },
              ],
            },
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@medusajs/medusa/workflow-engine-redis",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {
            "dynamodbOptions": {
              "hashKey": "user_id",
              "initialized": false,
              "prefix": "my_session:",
              "readCapacityUnits": 10,
              "skipThrowMissingSpecialKeys": true,
              "table": "test-sessions",
              "writeCapacityUnits": 10,
            },
          },
        },
      }
    `)
  })

  it("should allow custom dynamodb config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
          sessionOptions: {
            dynamodbOptions: {
              clientOptions: {
                endpoint: "http://localhost:8000",
              },
              table: "medusa-sessions",
              writeCapacityUnits: 25,
              readCapacityUnits: 25,
            },
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "api_key": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "event_bus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/medusa/file-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@medusajs/medusa/inventory",
          },
          "locking": {
            "resolve": "@medusajs/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/medusa/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "order": {
            "resolve": "@medusajs/medusa/order",
          },
          "payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "product": {
            "resolve": "@medusajs/medusa/product",
          },
          "promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "region": {
            "resolve": "@medusajs/medusa/region",
          },
          "sales_channel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "stock_location": {
            "resolve": "@medusajs/medusa/stock-location",
          },
          "store": {
            "resolve": "@medusajs/medusa/store",
          },
          "tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {
            "dynamodbOptions": {
              "clientOptions": {
                "endpoint": "http://localhost:8000",
              },
              "readCapacityUnits": 25,
              "table": "medusa-sessions",
              "writeCapacityUnits": 25,
            },
          },
        },
      }
    `)
  })
})
