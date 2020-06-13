const express = require('express'),
  bodyParser = require('body-parser'),
  materialRoutes = require('./materials');

const router = express.Router();

router.use(bodyParser.json());

router.use('/materials', materialRoutes);

module.exports = router;
