var express = require('express');
var router = express.Router();
const{limitdata}=require('../controllers/userController')

/* GET home page. */

router.get('/',limitdata)
module.exports = router;
