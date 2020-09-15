import {groupBy, isEqual} from 'lodash'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

const server = setupServer()

export const batchMock = mockConfigs => {
  const matchedMockConfigs = groupBy(mockConfigs, mockConfig => `${mockConfig.method}_${mockConfig.endpoint}`)

  for (let key in matchedMockConfigs) {
    let duplicatedMockConfig
    const isDuplicate = matchedMockConfigs[key].some(currentMockConfig => {
      const filtered = matchedMockConfigs[key].filter(mockConfig => {
        if (
          currentMockConfig.method === 'get' &&
          (currentMockConfig.response !== mockConfig.response || currentMockConfig.status !== mockConfig.status)
        ) {
          return true
        }
        if (
          currentMockConfig.method === 'post' &&
          isEqual(currentMockConfig.payload, mockConfig.payload) &&
          (!isEqual(currentMockConfig.response, mockConfig.response) || currentMockConfig.status !== mockConfig.status)
        ) {
          return true
        }
        return false
      })
      if (filtered.length >= 1) {
        duplicatedMockConfig = filtered[0]
        return true
      }
      return false
    })
    if (isDuplicate) {
      throw new Error(
        `find duplicate mocks with different response: method: ${duplicatedMockConfig.method}, endpoint: ${duplicatedMockConfig.endpoint}`
      )
    }

    merge(matchedMockConfigs[key])
  }
  return matchedMockConfigs
}

const merge = matchedMockConfig => {
  // one or more mockConfig, but method and endpoint, payload (if any) should be same here
  const {method, endpoint, ...others} = matchedMockConfig[0]
  server.use(
    rest[method](endpoint, (req, res, ctx) => {
      for (let key in matchedMockConfigs) {
        let payload, status, response

        if (method === 'get') {
          status = others.status
          response = others.response
          return res(ctx.status(200), ctx.json(response))
        }
        if (method === 'post') {
          payload = others.payload
          status = others.status
          response = others.response
          if (isEqual(req.data, payload)) {
            return res(ctx.status(200), ctx.json(response))
          }
        }
      }
      return res(ctx.status(400), ctx.json({message: 'no api matched'}))
    })
  )
}
