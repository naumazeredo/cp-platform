var express = require('express');
var router = express.Router();

/* GET logout */
router.get('/', function(req, res) {
  req.logout();
  res.redirect('back');
});

module.exports = router;
