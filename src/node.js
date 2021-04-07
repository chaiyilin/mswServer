const {isEqual} = require('lodash')
const {rest} = require('msw')
const {setupServer} = require('msw/node')

export const server = setupServer()

export let serves = []

export const listen = () => {
  server.listen()
}

export const serve = (method, endpoint, payload, status, response) => {
  server.use(
    rest[method](`${PEP_URL}${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(status), ctx.json(response))
    })
  )

  const matchedServes = serves.filter(serve => {
    if (serve.method === 'get') {
      if (arguments.length !== 4) {
        throw new Error(
          `method: ${method}, endpoint: ${endpoint}. when request method is get, there has to be 4 parameters: method, endpoint, status, response in order`
        )
      } else {
        const filtered = serves.filter(
          serve =>
            serve.method === method &&
            serve.endpoint === endpoint &&
            (serve.status !== status || !isEqual(serve.response, response))
        )
        if (filtered.length >= 1) {
          throw new Error(
            `method: ${method}, endpoint: ${endpoint}: found same method, endpoint but with different status or response`
          )
        } else {
          serves = [...serves, {method, endpoint, status, response}]
        }
      }
    }

    if (serve.method === 'post') {
      if (arguments.length !== 5) {
        throw new Error(
          `method: ${method}, endpoint: ${endpoint}. when request method is get, there has to be 5 parameters: method, endpoint,payload, status, response in order`
        )
      } else {
        const filtered = serves.filter(
          serve =>
            serve.method === method &&
            serve.endpoint === endpoint &&
            isEqual(serve.payload, payload) &&
            (serve.status !== status || !isEqual(serve.response, response))
        )
        if (filtered.length >= 1) {
          throw new Error(
            `method: ${method}, endpoint: ${endpoint}: found same method, endpoint and payload but with different status or response`
          )
        } else {
          serves = [...serves, {method, endpoint, payload, status, response}]
        }
      }
    }
  })
}

export const close = async () => {
  server.close()

  const fs = require('fs')
  const rootDir = await pkgDir(__dirname)
  fs.writeFileSync('serves.json', JSON.stringify(serves))
}
