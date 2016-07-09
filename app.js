var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var passport = require('passport');
var session  = require('express-session');
var flash    = require('connect-flash');

var GitHubStrategy = require('passport-github2').Strategy;
var LocalStrategy  = require('passport-local').Strategy;

var mongo = require('mongodb');
var db    = require('monk')('localhost/cp-platform');

var app = express();
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
app.use(session({
  secret: 'tempsecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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

var bcrypt = require('bcrypt-nodejs');

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
          if (user.profile.email === email) {
            return done(null, false, { message: 'Email already taken!' });
          } else {
            return done(null, false, { message: 'Username already taken!' });
          }
        }

        // Create new user
        var user = {
          profile : {
            username : username,
            email : email
          },
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
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    // Find user (case-insensitive)
    db.get('users').findOne({ 'profile.email': email.toLowerCase() }, function(err, user) {
      if (err)
        return done(err);

      // User not found
      if (!user)
        return done(null, false, { message: 'User not found!' });

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


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.get('users').findOne(id, function(err, user) {
    done(err, user);
  });
});

app.use(function(req, res, next) {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});

// ----------------------------------------------------
// Front-end libraries
// ----------------------------------------------------
// TODO(naum): Remove this on production and use CDN

// jQuery
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// Bootstrap
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/fonts')));

// Font-Awesome
app.use('/css', express.static(path.join(__dirname, '/node_modules/font-awesome/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/font-awesome/fonts')));
// ----------------------------------------------------

var routes   = require('./routes/index');
var articles = require('./routes/articles');

var login    = require('./routes/login')(passport);
var logout   = require('./routes/logout');
var signup   = require('./routes/signup')(passport);
var auth     = require('./routes/auth')(passport);

app.use('/', routes);
app.use('/articles', articles);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
