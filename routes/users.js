var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/isAuth')
var back=require('../middleware/back')
var mut=require('../middleware/multer')
const{login,signup,products,logout,password,changepassword,dashboard,verify,addproduct,register,alldata,alldata1,orders,moredetails,edituser,edituserpost}=require('../controllers/userController')
const{cart,deletecart,cartadding,checkout,qtyadd,qtyminus}=require('../controllers/orderController')
const{placeorder,paymentverify,success}=require('../controllers/paymentController')
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
router.get('/profile',isAuth,edituser)
router.post('/edit/:id',isAuth,edituserpost)
router.get('/changepassword',isAuth,changepassword)
router.post('/password',isAuth,password)
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
router.get('/moredetails/:id',isAuth,moredetails)


router.get('/products',isAuth,products)
router.get('/dashboard',isAuth,dashboard)
router.get('/adminAddProduct',isAuth,addproduct)
router.get('/allproducts1',isAuth,alldata)
router.get('/allproducts2',isAuth,alldata1)

router.get('/success/:id',success)


module.exports = router;
