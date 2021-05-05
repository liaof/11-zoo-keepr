//import the express.js package
const express = require ('express');
// needed to actually write to animals.json
const fs = require('fs');
const path = require('path');

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const { animals } = require('./data/animals');


//  process.eng.PORT is a Heroku environment variable
const PORT = process.env.PORT || 3001;
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

// any time a client naviages to <ourhost>/api the app will use the router we set up in apiRoutes
// if / is the endpoint then the router will serve back our HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

