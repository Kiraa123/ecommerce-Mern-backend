var express = require('express');
var router = express.Router();
const{home,limdata}=require('../controllers/userController')

/* GET home page. */
// router.get('/', function(req, res,next) {
//   const isUser=req.session.loggedIn

//   res.render('index',{isUser});
// });
router.get('/',limdata)
module.exports = router;
