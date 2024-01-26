var express = require('express');
var router = express.Router();
const{limdata}=require('../controllers/userController')

/* GET home page. */

router.get('/',limdata)
module.exports = router;
