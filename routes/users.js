var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/isAuth')
var back=require('../middleware/back')
var mut=require('../middleware/multer')
const{login,signup,products,logout,dashboard,verify,addproduct,register,alldata,orders}=require('../controllers/userController')
const{cart,deletecart,cartadding,checkout,qtyadd,qtyminus}=require('../controllers/orderController')
const{placeorder,paymentverify}=require('../controllers/paymentController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//get login page
router.get('/login',login)
router.get('/logout',logout)
router.post('/login',register)
router.post('/loggedin',verify)
router.get('/signup',signup)
//CART

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


router.get('/products',isAuth,products)
router.get('/dashboard',isAuth,dashboard)
router.get('/adminAddProduct',isAuth,addproduct)
router.get('/allproducts',isAuth,alldata)


module.exports = router;
