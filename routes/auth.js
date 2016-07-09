var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET GitHub OAuth2. */
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

/* GET GitHub OAuth2 callback. */
router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;
