var express = require('express');
var router = express.Router();

/* GET topic page. */
router.get('/', function(req, res, next) {
  res.render('topics', { title: 'CP Platform - Topics' });
});

module.exports = router;
