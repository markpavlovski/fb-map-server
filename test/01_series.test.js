process.env.PORT = 3001

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../app')
const seriesDB = require('../db/series')

chai.use(chaiHttp)

describe('series routes', () => {
  context('INDEX\tGET\t/series', () => {
    it('should list all series', (done) => {
      chai.request(server)
        .get('/series/')
        .end((err, res) => {
          var expected = { status: 200, body: seriesDB }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
  })

  context('SHOW\tGET\t/series/:id', () => {
    it('should list a single series', (done) => {
      chai.request(server)
        .get(`/series/${seriesDB[1].id}`)
        .end((err, res) => {
          var expected = { status: 200, body: seriesDB[1] }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })

    it('should return an error if the id does not match a series', (done) => {
      chai.request(server)
        .get('/series/999')
        .end((err, res) => {
          var expected = { status: 404 }
          var { error: { message, status } } = res

          assert.equal(status, status)
          assert.isNotNull(message)
          done()
        })
    })
  })

  context('CREATE\tPOST\t/series', () => {
    it('should create a new entry with name and valid UUID', (done) => {
      var name = 'Harry Potter'
      var regExUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      var lastItem = seriesDB.length

      chai.request(server)
        .post(`/series`)
        .send({ name })
        .end((err, res) => {
          var newSeries = seriesDB[lastItem]
          var charUUID = newSeries.id
          var hasValidUUID = regExUUID.test(charUUID)

          assert.property(newSeries, 'id')
          assert.property(newSeries,'name')
          assert.isTrue(hasValidUUID)
          done()
        })
    })
    it('should respond with the newly created resource', (done) => {
      var name = 'What About Bob'

      chai.request(server)
        .post(`/series`)
        .send({ name })
        .end((err, res) => {
          var expected = { status: 201 }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.property(body, 'id')
          assert.propertyVal(body, 'name', name)
          done()
        })
    })
    it('should return an error if the name is missing', (done) => {
      chai.request(server)
        .post(`/series`)
        .send({})
        .end((err, res) => {
          var expected = { status: 400 }
          var { error: { message, status } } = res

          assert.equal(status, expected.status)
          assert.isNotNull(message)
          done()
        })
    })
    it('should return an error for names that are not unique', (done) => {
      var name = 'What About Bob'

      chai.request(server)
        .post(`/series`)
        .send({ name })
        .end((err, res) => {
          var expected = { status: 400 }
          var { error: { message, status } } = res

          assert.equal(status, expected.status)
          assert.isNotNull(message)
          done()
        })
    })
  })

  context('UPDATE\tPUT\t/series/:id', () => {
    it('should update an existing resource', (done) => {
      var id = seriesDB[1].id
      var name = 'Zombieland'
      var nextState = { id , name }

      chai.request(server)
        .put(`/series/${id}`)
        .send({ name })
        .end((err, res) => {
          var newSeries = seriesDB.filter(series => series.id === id )[0]
          var expected = { body: newSeries }
          var { body } = res

          assert.deepEqual(nextState, expected.body)
          done()
        })
    })
    it('should return that updated resource', (done) => {
      var seriesID = seriesDB[1].id
      var name = 'Zombieland'

      chai.request(server)
        .put(`/series/${seriesID}`)
        .send({ name })
        .end((err, res) => {
          var newSeries = seriesDB.filter(series => series.id === seriesID)[0]
          var expected = { status: 200, body: newSeries }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    it('should return an error if the id is not found', (done) => {
      chai.request(server)
        .put('/series/999')
        .end((err, res) => {
          var expected = { status: 404 }
          var { error: { message, status } } = res

          assert.equal(status, expected.status)
          assert.isNotNull(message)
          done()
        })
    })
  })

  context('DESTROY\tDELETE\t/series/:id', () => {
    it('should delete a series resource', (done) => {
      var id = seriesDB[0].id
      var expectedNextState = seriesDB.slice(1)
      var expectedSeriesCount = expectedNextState.length

      chai.request(server)
        .delete(`/series/${id}`)
        .end((err, res) => {
          var seriesCount = seriesDB.length

          assert.deepEqual(seriesDB, expectedNextState)
          assert.equal(seriesCount, expectedSeriesCount)
          done()
        })
    })
    it('should respond with the deleted resource', (done) => {
      var id = seriesDB[0].id
      var deletedSeries = seriesDB.slice(0, 1)

      chai.request(server)
        .delete(`/series/${id}`)
        .end((err, res) => {
          var expected = { status: 200, body: deletedSeries }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    it('should return an error if the id is not found', (done) => {
      chai.request(server)
        .delete('/series/999')
        .end((err, res) => {
          var expected = { status: 404 }
          var { error: { message, status } } = res

          assert.equal(status, expected.status)
          assert.isNotNull(message)
          done()
        })
    })
    context('BOUNS\tWRITE YOUR OWN TEST', () => {
      xit('should delete all nested character resources')
    })
  })
})
