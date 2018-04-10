process.env.PORT = 3001

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../app')
const characterDB = require('../db/characters')

chai.use(chaiHttp)

describe('series character routes', () => {
  context('INDEX\tGET\t/series/:id/characters', () => {
    it('should respond with all characters for a particular series', (done) => {
      var seriesId = '98f900c6-7845-4ca5-8640-a361bd7d77ed'
      var characters = characterDB.filter(character => {
        return character.series_id === seriesId
      })

      chai.request(server)
        .get(`/series/${seriesId}/characters`)
        .end((err, res) => {
          var expected = { status: 200, body: characters }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
  })
})
