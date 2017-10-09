const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const uuid = require('uuid/v4')
const db = require('./db')

app.use(morgan('dev'))
app.use(bodyParser.json())

/*******************************************************************************

  STEP 1:

  Create a get all, get one, create, update, and delete route for the `series` resource.

  If there is an error, you should respond with the appropriate status code and a message in the following general format:

  {
    error: {
      status: 404,
      message: 'Could not find series with ID of '1'.'
    }
  }

  Each series must have a name. Dynamically generate the id using `uuid()` on creation.

********************************************************************************/

/********************************************************************************

  STEP 2:

  Create a get all, get one, create, update, and delete route
  for the `character` resource.

  You will also want to allow for a `limit` query parameter to limit the number
  of responses you receive. For example:

  `GET /characters?limit=4` -> Return only the first 4 characters

  You will also want to have a limit on the length of character names. They
  cannot be longer than 30 characters.

  If there is an error, you should respond with the appropriate status code
  and a message in the following general format:

  {
    error: {
      status: 404,
      message: 'Could not find character with ID of '1'.'
    }
  }

  Each character must have a name and series_id. The series_id must match an existing
  series. Dynamically generate the id using `uuid()` on creation.

********************************************************************************/

/********************************************************************************

  STEP 3:

  Create a route the gets all the characters apart of a given series:

  `/series/{ id }/characters`

********************************************************************************/

/********************************************************************************

  STRETCH 1:

  Implement a PATCH route for both resources.
  Your PUT route should now require all fields to be present per resource.

********************************************************************************/

/********************************************************************************

  STRETCH 2:

  You likely have some code that is very nearly the same
  with only a few differences.

  Refactor so that, for example, your GET routes use the same code
  regardless of the resource.

********************************************************************************/

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Fictional Character API listening on port ${port}!`)
  })
}

module.exports = app
