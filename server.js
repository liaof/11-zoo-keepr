//import the express.js package
const express = require ('express');
// needed to actually write to animals.json
const fs = require('fs');
const path = require('path');

const { animals } = require('./data/animals');


//  process.eng.PORT is a Heroku environment variable
const PORT = process.env.PORT || 3003;
//instantiate the server
const app = express();

//  .use mounts a function to the server that our requests will pass through before going to the inteded endpoint -it is a middleware
//   
// express.urlencoded({extended: true}) takes incoming POST data and converts into key/value pairings accessable in the req.body object 
// extended: true informs our server there may be sub-array data nested within, so it needs to look as deep into POST as possible 
// express.json takes incoming POST data in the form of JSON and parses it into the req.body object

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// provide a file path to the public folder, and instcut the server to make the folder into static resources; it has an absolute path
app.use(express.static('public'));

//*******req is the request object, which is the URL in this case */
//******  req.query is the portion of the URL after the '?'  *********

//takes in req.query as an argument, and filters it, then returns the new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        // We have a string here when there is only 1 trait; otherwise it would be an array already
        if (typeof query.personalityTraits === 'string') {
          personalityTraitsArray = [query.personalityTraits];
        } else {
          // we don't need to do anything here because it's assumed the input is otherwise an array
          personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
          // Check the trait against each animal in the filteredResults array.
          // Remember, it is initially a copy of the animalsArray,
          // but here we're updating it for each trait in the .forEach() loop.
          // For each trait being targeted by the filter, the filteredResults
          // array will then contain only the entries that contain the trait,
          // so at the end we'll have an array of animals that have every one 
          // of the traits when the .forEach() loop is finished.
          filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
          );
        });
    }

    //if there is a diet parameter in the url
    if (query.diet) {
        // filter() returns true when the animal parameter matches our query paramter, which then adds said animal to the filtered list
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    //if there is a species parameter in the url
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    //if there is a name parameter in the url
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}




//body here is the req.body from the POST route; it's the data we want to add to the server's animals.json
// this function takes the new animal data(body) and adds it to the animalsArray, then writes the new array data to animals.json
// then we send the untouched data back to the route's callback function so it can respond to the request
function createNewAnimal (body, animalsArray){
  console.log(body);
  // our function's main code will go here!

  const animal = body;
  animalsArray.push(animal);

  fs.writeFileSync(
    // combine the directory of the file we execute the code from (__dirname) with the path to the animals.json file to create an absolute path to the file we want to write to
    path.join(__dirname, './data/animals.json'),
    // convert the JavaScript array data to JSON
    // null means we don't want to edit any of our data, 2 indicates we want to create white space between our values for legibility
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  // return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}


// POST requests are used to send data to a server
// GET requests are used to request data from a specified resource ie a server

//first argument is a string that describes the route the client will have to fetch from
//second argument is the callback that executes everytime said route is accessed via .get
//  *more info - read about express routing
app.get('/api/animals', (req, res) => {//request, response

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
// root - /api/animals/
// paramter name - id
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

// .post defines a route that listens to POST requests, rather than GET requests
// it sends data from the server to the client
app.post('/api/animals', (req, res) => {
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
    res.json(req.body);
  }
});

// this .get method responds with an HTML page to display in the browser
app.get('/', (req, res) => {
  // tells the server where to find the file we want to read and send to the client
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// for when the client makes a req for a route that doesn't exist
// The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

