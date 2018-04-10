const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const uuid = require('uuid/v4')
const db = require('./db')

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))
app.use(bodyParser.json())

/*******************************************************************************

  STEP 1:

  Create a get all, get one, create, update, and delete route for the `series` resource.

  When you create a new series, you will have to check to see whether or not that series
  name is already taken. If it is, return an error.

  If there is an error, you should respond with the appropriate status code and a message
  in the following general format:

  {
    error: {
      status: 404,
      message: 'Could not find series with ID of '1'.'
    }
  }

  Each series must have a name. Dynamically generate the id using `uuid()` on creation.

********************************************************************************/


class Series {
  constructor (name='') {
    this.id = uuid()
    this.name = name
  }
}

let validateSeries =  (req, res, next) => {
  const series = db.series.find(series => series.id === req.params.id)
  if (series) {
    req.series = series
    next()
  } else {
    res.status(404).send({error: {message: 'no such series'}})
  }
}

app.get('/series', (req, res) => {
  res.send(db.series)
})

app.get('/series/:id', validateSeries, (req, res) => {
  const {id,name} = req.series
  res.status(200).send({id,name})
})

app.post('/series',  (req, res, next) =>{
  const series = new Series()
  if (!req.body.name) {
    res.status(400).send({error: {message: 'No name specified'}})
  }
  if (db.series.find(series => series.name === req.body.name)) {
    res.status(400).send({error: {message: 'This name already exists'}})
  }
  series.name = req.body.name
  db.series.push(series)
  res.status(201).send(series)
})

app.put('/series/:id', validateSeries, (req, res, next) => {
  if (req.body.name){
    req.series.name = req.body.name
    res.status(200).send(req.series)
  } else {
    res.status(400).send({error: {message: 'Please specify name'}})
  }
})







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
