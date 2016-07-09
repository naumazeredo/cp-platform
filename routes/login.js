var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('error') });
});

/* POST local login */
router.post('/', passport.authenticate('local-login', {
    successReturnToOrRedirect : '/', // TODO: change to /profile
    failureRedirect : '/login',
    failureFlash : true
  })
);

module.exports = router;
