//serverside animals.js
const fs = require("fs");
const path = require("path");
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
    console.log('created animal');
    // our function's main code will go here!
  
    const animal = body;
    animalsArray.push(animal);
  
    fs.writeFileSync(
      // combine the directory of the file we execute the code from (__dirname) with the path to the animals.json file to create an absolute path to the file we want to write to
      path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};