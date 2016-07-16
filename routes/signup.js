var express = require('express');
var passport = require('passport');
var router = express.Router();

/* POST local signup */
router.post('/', passport.authenticate('local-signup', {
  successRedirect : '/', // TODO(naum): Redirect to profile
  failureRedirect : '/login',
  failureFlash : true
}));

module.exports = router;
