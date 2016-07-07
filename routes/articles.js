var express = require('express');
var router = express.Router();

/* GET articles list page. */
router.get('/', function(req, res, next) {
  res.render('articles', { title: 'CP Platform - Articles' });
});

/* GET article page */
router.get('/:id', function(req, res, next) {
  res.render('article', { title: 'CP Platform - Article' });
});

module.exports = router;
