var express = require('express');
var router = express.Router();

var db = require('../config/db');

/* GET profile */
router.get('/:username', function(req, res, next) {
  db.get('users').findOne({ 'profile.username' : req.params.username }, function(err, user) {
    if (err)
      next();

    // TODO(naum): Create user not found page
    if (!user)
      next();

    res.render('profile', { title : 'Profile', user : user });
  });
});

module.exports = router;
