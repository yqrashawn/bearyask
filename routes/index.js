const express = require('express');
const router = express.Router();
const config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/ask', function(req, res) {
  console.log(req);
});






module.exports = router;
