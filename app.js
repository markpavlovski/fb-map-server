const express = require('express')
const app = express()
const port = process.env.PORT || 9999
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

app.get('/', (req, res) => {
 const map = `<html>
    <head></head>
    <body>
      <img src='http://placecage.com/300/300'/>
    </body>
  </html>`

  console.log(req.query)

  const centerLocation = req.query.latlng ? req.query.latlng : '47.628701, -122.343065'


  const page = `
  <!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Multiple Markers Google Maps</title>
        <style>
          * {
            margin: 0px;
            padding: 0px;
          }
        </style>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
        <script src="https://maps.googleapis.com/maps/api/js?v=3.11&sensor=false" type="text/javascript"></script>
        <script type="text/javascript">
        // check DOM Ready
        $(document).ready(function() {
            // execute
            (function() {
                // map options
                var options = {
                    zoom: 17,
                    center: new google.maps.LatLng(${centerLocation}), // centered US
                    // mapTypeId: google.maps.MapTypeId.TERRAIN,
                    mapTypeControl: false
                };

                // init map
                var map = new google.maps.Map(document.getElementById('map_canvas'), options);

                // NY and CA sample Lat / Lng
                //var southWest = new google.maps.LatLng(47.627080, -122.347431);
                //var northEast = new google.maps.LatLng(47.633025, -122.341202);
                var southWest = new google.maps.LatLng(47.624609, -122.365359);
                var northEast = new google.maps.LatLng(47.638253, -122.340436);

                var lngSpan = northEast.lng() - southWest.lng();
                var latSpan = northEast.lat() - southWest.lat();

                // set multiple marker
                for (var i = 0; i < 25; i++) {
                    // init markers
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(southWest.lat() + latSpan * Math.random(), southWest.lng() + lngSpan * Math.random()),
                        map: map,
                        title: 'Click Me ' + i
                    });

                    // process multiple info windows
                    (function(marker, i) {
                        // add click event
                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow = new google.maps.InfoWindow({
                                content: 'Hello, World!!'
                            });
                            infowindow.open(map, marker);
                        });
                    })(marker, i);
                }
            })();
        });
        </script>
    </head>
    <body>
        <div id="map_canvas" style="width: 100vw; height:100vh;"></div>
    </body>
</html>

  `

  res.send(page)
})

app.get('/series/:id', validateSeries, (req, res) => {
  res.status(200).send(req.series)
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

app.delete('/series/:id', validateSeries, (req, res, next) => {
    let index = db.series.findIndex(series => series.id === req.series.id)
    res.status(200).send(db.series.splice(index, 1))
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



class Character {
  constructor (name='') {
    this.id = uuid()
    this.name = name
  }
}

let validateCharacter =  (req, res, next) => {
  const character = db.characters.find(character => character.id === req.params.id)
  if (character) {
    req.character = character
    next()
  } else {
    res.status(404).send({error: {message: 'no such character'}})
  }
}

app.get('/characters', (req, res) => {
  if (req.query.limit){
    res.send(db.characters.slice(0,req.query.limit))
  }
  res.send(db.characters)
})

app.get('/characters/:id', validateCharacter, (req, res) => {
  res.status(200).send(req.character)
})

app.post('/characters', (req, res, next) =>{
  const character = new Character()
  if (!req.body.name) {
    res.status(400).send({error: {message: 'No name specified'}})
  }
  if (req.body.name.length > 30) {
    res.status(400).send({error: {message: 'Name too long'}})
  }
  if (db.characters.find(character => character.name === req.body.name)) {
    res.status(400).send({error: {message: 'This name already exists'}})
  }
  character.name = req.body.name
  db.characters.push(character)
  res.status(201).send(character)
})

app.put('/characters/:id', validateCharacter, (req, res, next) => {
  if (req.body.name){
    req.character.name = req.body.name
    res.status(200).send(req.character)
  } else {
    res.status(400).send({error: {message: 'Please specify name'}})
  }
})

app.delete('/characters/:id', validateCharacter, (req, res, next) => {
    let index = db.characters.findIndex(character => character.id === req.character.id)
    res.status(200).send(db.characters.splice(index, 1))
})






/********************************************************************************

  STEP 3:

  Create a route the gets all the characters apart of a given series:

  `/series/{ id }/characters`

********************************************************************************/



app.get('/series/:id/characters', validateSeries, (req, res) => {
  res.status(200).send(db.characters.filter(character => character.series_id === req.series.id))
})







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
