var session  = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

var db       = require('./db');

module.exports.init = function(app) {
  // Init session, passport and flash
  app.use(session({
    secret: 'tempsecret',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // Middleware to pass user in response
  app.use(function(req, res, next) {
    if (req.user) {
      res.locals.user = req.user;
    }
    next();
  });

  // Define serialization
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    db.get('users').findOne(id, function(err, user) {
      done(err, user);
    });
  });

  // Load strategies
  require('./strategies/local')();
  require('./strategies/github')();
};
