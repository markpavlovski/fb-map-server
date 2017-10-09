process.env.PORT = 3001

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../app')
const characterDB = require('../db/characters')

chai.use(chaiHttp)

describe('series character routes', () => {
  context('INDEX\tGET\t/series/:id/characters', () => {
    xit('should respond with all characters for a particular series', (done) => {
      var seriesId = characterDB[0].series_id
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
