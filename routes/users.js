var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/isAuth')
var back=require('../middleware/back')
var mut=require('../middleware/multer')
const{login,signup,products,logout,dashboard,verify,addproduct,register,alldata,show}=require('../controllers/userController')
const{cart,deletecart,cartadding,checkout,qtyadd,qtyminus,placeorder}=require('../controllers/orderController')
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
// router.get('/cart',isAuth,cart)
// router.get('/cart/:id',isAuth,cartadding)
// router.post('/add-to-cart',adding)
// router.get('cart',(req,res)=>{
//   res.render('cart')

// })
// router.post('/addc/:id',isAuth,adding)
router.get('/cart',isAuth,cart)
router.get('/addcart/:id',isAuth,cartadding)
router.get('/checkout',isAuth,checkout)
router.get('/cart/qtyadd/:id',isAuth,qtyadd)
router.get('/cart/qtyminus/:id',isAuth,qtyminus)
router.get('/cart/delete/:id',isAuth,deletecart)
router.get('/checkout',isAuth,checkout)
router.post('/placeorder',isAuth,placeorder)


router.get('/products',products)
router.get('/dashboard',dashboard)
router.get('/adminAddProduct',addproduct)
router.get('/allproducts',isAuth,alldata)
// router.get('/showProduct',dHome)




// router.get('/createAdmin',isAuth,function(req,res){
//   res.redirect('/admin/ create')
// });

module.exports = router;
