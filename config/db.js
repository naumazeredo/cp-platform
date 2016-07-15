var util = require('util');
var mongourl = util.format('mongo:%s/cpplatform', process.env.MONGO_PORT);
var db = require('monk')(mongourl);

module.exports = db;
