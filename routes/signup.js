var express = require('express');
var router = express.Router();

module.exports = function(passport) {

  /* GET signup page. */
  router.get('/', function(req, res) {
    res.render('signup', { title: 'Sign up', message: req.flash('error') });
  });

  /* POST local signup */
  router.post('/', passport.authenticate('local-signup', {
      successRedirect : '/', // TODO: change to /profile
      failureRedirect : '/signup',
      failureFlash : true
    })
  );

  return router;
}
