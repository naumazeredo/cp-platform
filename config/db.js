var db = require('monk')(process.env.DB_PATH);

module.exports = db;
