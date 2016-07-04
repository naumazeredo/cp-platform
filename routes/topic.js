var express = require('express');
var router = express.Router();

/* GET topic page. */
router.get('/', function(req, res, next) {
  res.render('topic', { title: 'CP Platform - Topic' });
});

module.exports = router;
