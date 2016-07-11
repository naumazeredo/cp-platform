var express = require('express');
var router = express.Router();

var db = require('../config/db');

/* GET profile */
router.get('/:id', function(req, res, next) {
  db.get('users').find({ _id : req.params.id }, function(err, user) {
    if (err)
      next();

    res.render('profile', { title : 'Profile', user : user });
  });
});

module.exports = router;
