import zod from "zod"
import { defineMiddlewares } from "../define-middlewares"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

describe("defineMiddlewares", function () {
  test("define custom middleware for a route", () => {
    const config = defineMiddlewares([
      {
        matcher: "/admin/products",
        middlewares: [() => {}],
      },
    ])

    expect(config).toMatchObject({
      routes: [
        {
          matcher: "/admin/products",
          middlewares: [expect.any(Function)],
        },
      ],
    })
  })

  test("should wrap additionalDataValidator to middleware", () => {
    const req = {
      body: {},
    } as MedusaRequest
    const res = {} as MedusaResponse
    const nextFn = jest.fn()
    const schema = {
      brand_id: zod.string(),
    }

    const config = defineMiddlewares([
      {
        matcher: "/admin/products",
        additionalDataValidator: schema,
      },
    ])

    expect(config).toMatchObject({
      routes: [
        {
          matcher: "/admin/products",
          middlewares: [expect.any(Function)],
        },
      ],
    })

    config.routes?.[0].middlewares?.[0](req, res, nextFn)
    expect(req.additionalDataValidator!.parse({ brand_id: "1" })).toMatchObject(
      {
        brand_id: "1",
      }
    )
  })
})
