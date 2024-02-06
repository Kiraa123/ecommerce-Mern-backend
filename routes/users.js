var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/isAuth')
var noCache=require('../middleware/noCache')
const{login,signup,products,logout,password,changepassword,verify,validateotp,timeexeed,register,alldata,alldata1,orders,moredetails,edituser,edituserpost,forgotpassword,sendotp,resetpassword}=require('../controllers/userController')
const{cart,deletecart,cartadding,checkout,qtyadd,qtyminus}=require('../controllers/orderController')
const{placeorder,paymentverify,success}=require('../controllers/paymentController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//get login page
router.get('/login',noCache,login)
router.get('/logout',noCache,logout)
router.post('/login',register)
router.post('/loggedin',verify)
router.get('/signup',signup)
router.post('/validateotp',validateotp)
router.get('/timeexceed/:id',timeexeed)
router.get('/profile',isAuth,edituser)
router.post('/edit/:id',isAuth,edituserpost)
router.get('/changepassword',isAuth,changepassword)
router.post('/password',isAuth,password)
router.get('/forgotpassword',forgotpassword)
router.post('/sendotp',sendotp)
router.post('/resetpassword',resetpassword)

router.get('/cart',isAuth,cart)
router.get('/addcart/:id',isAuth,cartadding)
router.get('/checkout',isAuth,checkout)
router.get('/cart/qtyadd/:id',isAuth,qtyadd)
router.get('/cart/qtyminus/:id',isAuth,qtyminus)
router.get('/cart/delete/:id',isAuth,deletecart)
router.get('/checkout',isAuth,checkout)
router.post('/placeorder',isAuth,placeorder)
router.post('/verifypayment',isAuth,paymentverify)
router.get('/orders',isAuth,orders)
router.get('/moredetails/:id',moredetails)


router.get('/products',isAuth,products)
router.get('/allproducts1',alldata)
router.get('/allproducts2',alldata1)

router.get('/success/',success)


module.exports = router;
