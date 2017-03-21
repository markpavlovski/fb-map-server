process.env.PORT = 3001
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../app')

let character = require('../resources/character')
let series = require('../resources/series')

chai.use(chaiHttp)

describe('series routes', () => {
  describe('INDEX\tGET\t/series', () => {
    it('should list all series', (done) => {
      chai.request(server)
        .get('/series/')
        .end((err, res) => {
          var expected = { status: 200, body: series }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
  })

  describe('SHOW\tGET\t/series/:id', () => {
    it('should list a single series', (done) => {
      chai.request(server)
        .get(`/series/${series[1].id}`)
        .end((err, res) => {
          var expected = { status: 200, body: series[1] }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })

    it('should return an error if the id does not match a series', (done) => {
      chai.request(server)
        .get('/series/1')
        .end((err, res) => {
          assert.isNotNull(err.body)
          var expected = { status: 404 }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.equal(body.status, expected.status)
          assert.isNotNull(body.message)
          done()
        })
    })
  })

  describe('CREATE\tPOST\t/series', () => {
    it('should create and return a new resource', (done) => {
      var name = 'Harry Potter'
      chai.request(server)
        .post(`/series`)
        .send({ name })
        .end((err, res) => {
          var newSeries = series.filter(item => item.name === name)[0]
          var expected = { status: 201, body: newSeries }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    it('should return an error if the name is missing', (done) => {
      chai.request(server)
        .post(`/series`)
        .send({})
        .end((err, res) => {
          var newSeries = series.filter(item => item.name === name)[0]
          var expected = { status: 201, body: newSeries }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    it('should only include a name key')
  })

  describe('UPDATE\tPUT\t/series/:id', () => {
    it('should update an existing resource')
    it('should return that updated resource')
    it('should return an error if the id is not found')
    it('should return an error if an invalid field is added')
  })

  describe('DESTROY\tDELETE\t/series/:id', () => {
    it('should delete a resource')
    it('should return that deleted resource')
    it('should return an error if the id is not found')
  })
})
