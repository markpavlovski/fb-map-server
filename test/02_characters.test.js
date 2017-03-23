process.env.PORT = 3001

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../app')

let characterDB = require('../db/character')

chai.use(chaiHttp)

describe('character routes', () => {
  context('INDEX\tGET\t/characters', () => {
    xit('should list all characters', (done) => {
      chai.request(server)
        .get('/characters')
        .end((err, res) => {
          var expected = { status: 200, body: characterDB }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    xit('should limit results shown to no more than amount specified by provided "limit" query param', (done) =>{
      var filteredCharacters = characterDB.slice(0, 3)

      chai.request(server)
        .get('/characters/?limit=3')
        .end((err, res) => {
          var expected = { status: 200, body: filteredCharacters }
          var { body, status } = res
          var characterCount = body.length

          assert.equal(status, expected.status)
          assert.isAtMost(characterCount, 3)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
  })

  context('SHOW\tGET\t/characters/:id', () => {
    xit('should list a single character', (done) => {
      chai.request(server)
        .get(`/characters/${characterDB[1].id}`)
        .end((err, res) => {
          var expected = { status: 200, body: characterDB[1] }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })

    xit('should return an error if the id does not match a character', (done) => {
      chai.request(server)
        .get('/characters/999')
        .end((err, res) => {
          var expected = { status: 404 }
          var { body, status } = res

          assert.isNotNull(err.body)
          assert.equal(status, expected.status)
          assert.isNotNull(body.message)
          done()
        })
    })
  })

  context('CREATE\tPOST\t/characters', () => {
    xit('should create a new entry with name and valid UUID', (done) => {
      var name = 'Harry Potter'
      var regExUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      var lastItem = characterDB.length

      chai.request(server)
        .post(`/characters`)
        .send({ name })
        .end((err, res) => {
          var newCharacter = characterDB[lastItem]
          var charUUID = newCharacter.id
          var hasValidUUID = regExUUID.test(charUUID)

          assert.property(newCharacter, 'id')
          assert.property(newCharacter,'name')
          assert.isTrue(hasValidUUID)
          done()
        })
    })
    xit('should respond with the newly created resource', (done) => {
      var name = 'Dr. Leo Marvin'

      chai.request(server)
        .post(`/characters`)
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
    xit('should return an error if the name is missing', (done) => {
      chai.request(server)
        .post(`/characters`)
        .send({})
        .end((err, res) => {
          var expected = { status: 400 }
          var { body, status } = res

          assert.isNotNull(err.body)
          assert.equal(status, expected.status)
          assert.isNotNull(body.message)
          done()
        })
    })
    xit('should return an error for names that are longer than 30 characters', (done) => {
      var name = 'Oscar Zoroaster Phadrig Isaac Norman Henkel Emmannuel Ambroise Diggs'

      chai.request(server)
        .post(`/characters`)
        .send({ name })
        .end((err, res) => {
          var expected = { status: 400 }
          var { body, status } = res

          assert.isNotNull(err.body)
          assert.equal(status, expected.status)
          assert.isNotNull(body.message)
          done()
        })
    })
  })

  context('UPDATE\tPUT\t/characters/:id', () => {
    xit('should update an existing resource', (done) => {
      var id = characterDB[1].id
      var name = 'Zombieland'
      var nextState = { id , name }

      chai.request(server)
        .put(`/characters/${id}`)
        .send({ name })
        .end((err, res) => {
          var newCharacter = characterDB.filter(character => character.id === id )[0]
          var expected = { body: newCharacter }
          var { body } = res

          assert.deepEqual(nextState, expected.body)
          done()
        })
    })
    xit('should return that updated resource', (done) => {
      var characterID = characterDB[1].id
      var name = 'Zombieland'

      chai.request(server)
        .put(`/characters/${characterID}`)
        .send({ name })
        .end((err, res) => {
          var newCharacter = characterDB.filter(character => character.id === characterID)[0]
          var expected = { status: 200, body: newCharacter }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    xit('should return an error if the id is not found', (done) => {
      chai.request(server)
        .put('/characters/999')
        .end((err, res) => {
          var expected = { status: 404 }
          var { body, status } = res

          assert.isNotNull(err.body)
          assert.equal(status, expected.status)
          assert.isNotNull(body.message)
          done()
        })
    })
  })

  context('DESTROY\tDELETE\t/characters/:id', () => {
    xit('should delete a resource', (done) => {
      var id = characterDB[0].id
      var expectedNextState = characterDB.slice(1)
      var expectedCharacterCount = expectedNextState.length

      chai.request(server)
        .delete(`/characters/${id}`)
        .end((err, res) => {
          var characterCount = characterDB.length

          assert.deepEqual(characterDB, expectedNextState)
          assert.equal(characterCount, expectedCharacterCount)
          done()
        })
    })
    xit('should respond with the deleted resource', (done) => {
      var id = characterDB[0].id
      var deletedCharacter = characterDB.slice(0, 1)

      chai.request(server)
        .delete(`/characters/${id}`)
        .end((err, res) => {
          var expected = { status: 200, body: deletedCharacter }
          var { body, status } = res

          assert.equal(status, expected.status)
          assert.deepEqual(body, expected.body)
          done()
        })
    })
    xit('should return an error if the id is not found', (done) => {
      chai.request(server)
        .delete('/characters/999')
        .end((err, res) => {
          var expected = { status: 404 }
          var { body, status } = res

          assert.isNotNull(err.body)
          assert.equal(status, expected.status)
          assert.isNotNull(body.message)
          done()
        })
    })
  })
})
