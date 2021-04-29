const { animals } = require('/data/animals');
//import the express.js package
const express = require ('express');

//  process.eng.PORT is a Heroku environment variable
const PORT = process.env.PORT || 3002;
//instantiate the server
const app = express();

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

//first argument is a string that describes the route the client will have to fetch from
//second argument is the callback that executes everytime said route is accessed via .get
app.get('/data/animals', (req, res) => {

    let results = animals;
    console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    //   .send is only good for short messages
    //res.send('Hello!');

    //   .json is more robust
    res.json(results);

});

app.listen(80, () => {
    console.log(`API server now on port ${PORT}!`);
});