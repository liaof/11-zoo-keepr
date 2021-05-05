const path = require('path');
const router = require('express').Router();

//*******req is the request object, which is the URL in this case */
//******  req.query is the portion of the URL after the '?'  *********
//********app represents a single instance of the Express.js server */

// POST requests are used to send data to a server
// GET requests are used to request data from a specified resource ie a server


// this .get method responds with an HTML page to display in the browser
router.get('/', (req, res) => {
    // tells the server where to find the file we want to read and send to the client
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
  
router.get('/animals', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});
  
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});
  
// for when the client makes a req for a route that doesn't exist
// The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router;