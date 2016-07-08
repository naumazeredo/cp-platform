var express = require('express');
var router = express.Router();

module.exports = function(passport) {

  /* GET login page. */
  router.get('/', function(req, res) {
    res.render('login', { title: 'Login', message: req.flash('error') });
  });

  /* POST local login */
  router.post('/', passport.authenticate('local-login', {
      successRedirect : '/', // TODO: change to /profile
      failureRedirect : '/login',
      failureFlash : true
    })
  );


  return router;
};
