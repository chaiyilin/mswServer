import {batchMock} from './browser'

describe('server', () => {
  test('can group if data is correct', () => {
    const mockConfigs = [
      {
        method: 'post',
        endpoint: '/ib4b/bff/cro/validate/challenge',
        payload: {crn: 1},
        status: 200,
        response: {
          authenticationMode: 'Shield',
          shieldDetails: {
            tokenId: '1234567abc1234xyz'
          }
        }
      },
      {
        method: 'post',
        endpoint: '/ib4b/bff/cro/validate/challenge',
        // payload is different
        payload: {crn: 2},
        status: 200,
        // response can be same or different. does not matter
        response: {
          authenticationMode: 'Shield',
          shieldDetails: {
            tokenId: '1234567abc1234xyz'
          }
        }
      },
      // get does not have payload
      {
        method: 'get',
        endpoint: '/ib4b/bff/cro/validate/challenge',
        //payload: {crn: 1},
        status: 200,
        response: {
          authenticationMode: 'Shield',
          shieldDetails: {
            tokenId: '1234567abc1234xyz'
          }
        }
      }
    ]
    expect(batchMock(mockConfigs)).toEqual({
      'get_/ib4b/bff/cro/validate/challenge': [
        {
          endpoint: '/ib4b/bff/cro/validate/challenge',
          method: 'get',
          response: {
            authenticationMode: 'Shield',
            shieldDetails: {
              tokenId: '1234567abc1234xyz'
            }
          },
          status: 200
        }
      ],
      'post_/ib4b/bff/cro/validate/challenge': [
        {
          endpoint: '/ib4b/bff/cro/validate/challenge',
          method: 'post',
          payload: {
            crn: 1
          },
          response: {
            authenticationMode: 'Shield',
            shieldDetails: {
              tokenId: '1234567abc1234xyz'
            }
          },
          status: 200
        },
        {
          endpoint: '/ib4b/bff/cro/validate/challenge',
          method: 'post',
          payload: {
            crn: 2
          },
          response: {
            authenticationMode: 'Shield',
            shieldDetails: {
              tokenId: '1234567abc1234xyz'
            }
          },
          status: 200
        }
      ]
    })
  })
  test('can not group if mock matched but response are different', () => {
    const mockConfigs = [
      {
        method: 'post',
        endpoint: '/ib4b/bff/cro/validate/challenge',
        payload: {crn: 1},
        status: 200,
        response: {
          authenticationMode: 'Shield',
          shieldDetails: {
            tokenId: '1234567abc1234xyz'
          }
        }
      },
      {
        method: 'post',
        endpoint: '/ib4b/bff/cro/validate/challenge',
        payload: {crn: 1},
        status: 200,
        // response can be same or different. does not matter
        response: {
          authenticationMode: 'Shield1',
          shieldDetails: {
            tokenId: '1234567abc1234xyz'
          }
        }
      }
    ]
    try {
      batchMock(mockConfigs)
    } catch (e) {
      expect(e.message).toBe(
        'find duplicate mocks with different response: method: post, endpoint: /ib4b/bff/cro/validate/challenge'
      )
    }
  })
})
