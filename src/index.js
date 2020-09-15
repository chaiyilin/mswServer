import {rest} from 'msw'
import {setupServer} from 'msw/node'

export const server = setupServer()

let serves = []

export const listen = () => {
  server.listen()
}
export const close = () => {
  server.close()
  const fs = require('fs')
  fs.writeFile('myjsonfile.json', json, 'utf8', callback)
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
        throw new Error('when request method is get, there has to be 4 parameters: method, endpoint, status, response')
      } else {
      }
    }

    if (serve.method === 'post') {
      if (arguments.length !== 5) {
        throw new Error(
          'when request method is post, there has to be 5 parameters: method, endpoint, payload, status, response'
        )
      } else {
      }
    }
  })
}
