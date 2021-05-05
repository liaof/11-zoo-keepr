
// We use router over app here because it alows you to declare routes in any file with proper middleware
// an app defined in server.js does not exist natively here, and must be passed each time a request is made, which is very slow
const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

/*******req is the request object, which is the URL in this case */
//******  req.query is the portion of the URL after the '?'  *********
//********app represents a single instance of the Express.js server */

// POST requests are used to send data to a server
// GET requests are used to request data from a specified resource ie a server


//first argument is a string that describes the route the client will have to fetch from
//second argument is the callback that executes everytime said route is accessed via .get
//  *more info - read about express routing
router.get('/animals', (req, res) => {//request, response

    let results = animals;
    //console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    //   .send is only good for short messages
    //res.send('Hello!');

    //   .json is more robust
    res.json(results);

});

// ** handle requests for a specific animal **
// root - /animals/
// paramter name - id
// this method gets the URL, seeks out the value of the id parameter in the URL
// it then it returns the json of the animal element with a matching id
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

// .post defines a route that listens to POST requests, rather than GET requests
// it sends data from the server to the client
router.post('/animals', (req, res) => {
  // req.body is where our incoming content will be
  // set id basd on what the index of the next array element would be
  req.body.id = animals.length.toString();
  
  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    // add animal to json file and animals array in this funciton
    const animal = createNewAnimal(req.body, animals);

    //send the data back to the client
    res.json(animal);
  }
});

module.exports  = router;