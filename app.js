var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var session      = require('express-session');
var passport     = require('passport');
var flash        = require('connect-flash');

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Init session, passport and flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Use passport session
app.use(passport.initialize());
app.use(passport.session());

// Use flash
app.use(flash());

// Middleware hold resources for each request
app.use(function(req, res, next) {
  res.locals.currentUser = req.user; // Set current user
  app.locals.moment = require('moment'); // Load momentjs

  next();
});

// Configuring Passport
require('./config/passport').init(app);

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

/* Routes */
var index    = require('./routes/index');
var articles = require('./routes/articles');

var login    = require('./routes/login');
var logout   = require('./routes/logout');
var signup   = require('./routes/signup');
var auth     = require('./routes/auth');

var profile  = require('./routes/profile');

app.use('/', index);
app.use('/articles', articles);

app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/auth', auth);

app.use('/profile', profile);

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
