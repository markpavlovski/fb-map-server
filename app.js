const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const uuid = require('uuid/v4')
// You should install and save the `body-parser` module and require it here
// You should include both resources as well

// Use the `body-parser` module



/*******************************************************************************

  STEP 1:

  Create a get all, get one, create, update, and delete route for the `series` resource.

  If there is an error, you should respond with the appropriate status code and a message in the following general format:

  {
    status: 404,
    message: 'Could not find series with ID of '1'.'
  }

  Each series must have a name. Dynamically generate the id using `uuid()` on creation.

********************************************************************************/




/********************************************************************************

  STEP 2:

  Create a get all, get one, create, update, and delete route
  for the `character` resource.

  If there is an error, you should respond with the appropriate status code
  and a message in the following general format:

  {
    status: 404,
    message: 'Could not find character with ID of '1'.'
  }

  Each character must have a name and series_id.
  The series_id must match an existing series.
  Dynamically generate the id using `uuid()` on creation.

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
/********************************************************************************

  STRETCH 2:

  You likely have some code that is very nearly the same
  with only a few differences.

  Refactor so that, for example, your GET routes use the same code
  regardless of the resource.

*********************************************************************************
********************************************************************************/



if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Fictional Character API listening on port ${port}!`)
  })
}

module.exports = app
