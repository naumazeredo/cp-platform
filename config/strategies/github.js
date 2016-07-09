var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var db = require('../db');

module.exports = function() {
  passport.use(new GitHubStrategy({
      clientID: '3a1030269155c017315a',
      clientSecret: '9e6fcdfabbc2762689108eccd2de01f9b49be79d',
      callbackUrl: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // XXX(naum): This login overwrites everything listed in updates object

      // List all fields that will be updated
      var updates = {
        profile : {
          username:   profile.username,
          email:      profile._json.email,
          avatar_url: profile._json.avatar_url,
          github_id:  profile.id,
        },
        usernameLower: profile.login
      };

      db.get('users').findOneAndUpdate(
        {
          $or : [
            { 'profile.email': profile._json.email },
            { 'profile.github_id': profile.id }
          ]
        },
        updates,
        { upsert: true },
        function(err, user) {
          if (err)
            return done(err);
          return done(null, user);
        }
      );
    }
  ));
};
