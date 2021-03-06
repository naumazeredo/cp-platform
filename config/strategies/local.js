var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db            = require('../db');
var bcrypt        = require('bcrypt-nodejs');

module.exports = function() {
  var isValidPassword = function(user, password, callback) {
    // If user have no password, than (s)he logged by social media
    if (!user.password)
      return callback(null, false, { message: 'Email bound to social media!' });

    bcrypt.compare(password, user.password, callback);
  };

  var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      req.flash('tab', 'signup');

      var email = req.body.email.toLowerCase();

      var usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
      var emailRegex = /^.+@.+$/;
      var passwordRegex = /^.{6,}$/;

      // Validations
      if (!usernameRegex.test(username))
        return done(null, false, 'Username incorrect format!');

      if (!emailRegex.test(email))
        return done(null, false, 'Email incorrect format!');

      if (!passwordRegex.test(password))
        return done(null, false, 'Password too small (6 or more characters)!');

      // Search
      db.get('users').findOne(
        {
          $or: [
            { 'profile.email' : email },
            { usernameLower : username.toLowerCase() }
          ]
        },
        function(err, user) {
          if (err)
            return done(err);

          // User exists
          if (user) {
            if (user.profile.username === username)
              return done(null, false, { message: 'Username already taken!' });
            else
              return done(null, false, { message: 'Email already taken!' });
          }

          // Create new user
          var user = {
            profile : {
              username : username,
              email : email
            },
            authored: [],
            contribution: [],
            handles: {
              Codeforces: 'kogyblack'
            },
            registeredAt: new Date(),
            password : generateHash(password),
            usernameLower : username.toLowerCase(),
          };

          db.get('users').insert(user, function(err, res) {
            done(err, res);
          });
        }
      );
    }
  ));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      req.flash('tab', 'login');

      // Find user (case-insensitive)
      db.get('users').findOne({ usernameLower: username.toLowerCase() }, function(err, user) {
        if (err)
          return done(err);

        // User not found
        if (!user)
          return done(null, false, { message: 'User not found!', tab: 'login' });

        // Validate given password
        isValidPassword(user, password, function(err, res, flash) {
          if (err)
            return done(err);

          // Password not valid
          if (!res) {
            // If callback has flash message
            if (flash)
              return done(null, false, flash)

            return done(null, false, { message: 'Incorrect password!' });
          }

          // Password valid, return user
          return done(null, user);
        });
      });
    }
  ));
};
