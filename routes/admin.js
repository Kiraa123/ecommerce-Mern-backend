var express = require('express');
var router = express.Router();
const user = require('../controllers/userController')
var upload=require('../middleware/multer')
const isAuth=require('../middleware/isAuth')
const isAdmin=require('../middleware/isAdmin')
const noCache=require('../middleware/noCache')
const Product=require('../controllers/productController')

const{orders,confirm,shipped,delivered,cancelled}=require('../controllers/orderController')
const{admin,createAdmin,getbanner,banner,postbanner,edit_banner,editbanners,deletebanner,dashboard,alluser,deleteuser,edituserpost,coupon,addcoupon,postaddcoupon,editcoupon,addproduct,filterOrder,filterType,filterStatus,blockuser,unblockuser,edituser,deleteproduct,editproduct,edit_product,searchuser,adminlogout}=require('../controllers/adminController')
const{addProduct,allproducts}=require('../controllers/productController')

router.post('/loggedin',admin)
router.post('/addproduct',upload.single('image'),addProduct);
router.get('/adminAddProduct',isAuth,addproduct)

router.get('/dashboard',isAdmin,isAuth,dashboard)
//PRODUCTS
router.get('/banner',isAdmin,getbanner)
router.get('/addbanners',isAdmin,banner)
router.post('/addbanners',isAdmin,postbanner)
router.get('/edit_banner/:id',isAdmin,editbanners)
router.post('/edit_banner/:id',isAdmin,upload.single('bannerImage'),edit_banner)
router.get('/delete_banner/:id',isAdmin,deletebanner)
router.get('/deleteuser/:id',isAdmin,isAuth,deleteuser);
router.post('/updateuser/:id',isAdmin,isAuth,edituserpost)
router.get('/edituser/:id',isAdmin,isAuth,edituser)
router.get('/deleteuser/:id',isAdmin, isAuth,deleteuser);
router.get('/blockuser/:id',isAdmin,isAuth,blockuser);
router.get('/unblockuser/:id',isAdmin,isAuth,unblockuser);
router.get('/edit_product/:id',isAdmin,isAuth,editproduct)
router.post('/edit_products/:id',isAdmin,isAuth,upload.single('image'),edit_product)
router.get('/products',isAdmin,isAuth,allproducts)
router.get('/products/deleteproduct/:id',isAdmin,isAuth,deleteproduct);
router.get('/alluser1',isAdmin,isAuth,alluser)
router.get('/searchuser',isAdmin,isAuth,searchuser)
router.get('/logout',noCache,adminlogout)

//ORDERS
router.get("/filter", isAdmin, filterOrder);
router.get("/filter/:paymentMethod", isAdmin, filterType);
router.get("/filterStatus/:status",isAdmin, filterStatus)
router.get('/order',isAdmin,isAuth,orders);
router.get('/confirm/:id',isAdmin,isAuth,confirm);
router.get('/shipped/:id',isAdmin,isAuth,shipped);
router.get('/delivered/:id',isAdmin,isAuth,delivered);
router.get('/cancelled/:id',isAdmin,isAuth,cancelled);

//  COUPON
router.get('/coupon',coupon)
router.get('/addcoupon',addcoupon)
router.post('/addcoupon',postaddcoupon)
router.get('/editcoupon',editcoupon)



module.exports = router;



