const router = require('express').Router();
// use the module exported from animalsRoutes.js
// this way we make apiRoutes/index.js the central hub for all routing functions we want to add
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');
router.use(require('./zookeeperRoutes'));

router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;