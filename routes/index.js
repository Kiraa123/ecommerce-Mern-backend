var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const isUser=req.session.loggedIn

  res.render('index',{isUser});
});

module.exports = router;
