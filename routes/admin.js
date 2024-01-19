var express = require('express');
var router = express.Router();
const user = require('../controllers/userController')
var upload=require('../middleware/multer')
const isAuth=require('../middleware/isAuth')

const Product=require('../controllers/productController')

const{orders,confirm,shipped,delivered,cancelled}=require('../controllers/orderController')
const{admin,createAdmin,alluser,deleteuser,edituserpost,blockuser,unblockuser,edituser,editproduct,edit_product}=require('../controllers/adminController')
const{addProduct,allproducts,addproductpage}=require('../controllers/productController')

router.post('/loggedin',admin)
router.post('/getProduct',upload.single('image'),addProduct);
//PRODUCTS
router.get('/deleteuser/:id',isAuth,deleteuser);
router.post('/updateuser/:id',isAuth,edituserpost)
router.get('/edituser/:id',isAuth,edituser)
router.get('/deleteuser/:id', isAuth,deleteuser);
router.get('/blockuser/:id',isAuth,blockuser);
router.get('/unblockuser/:id',isAuth,unblockuser);
router.get('/edit_product/:id',isAuth,editproduct)
router.post('/edit_products/:id',isAuth,upload.single('image'),edit_product)
router.get('/products',isAuth,allproducts)
router.get('/alluser',isAuth,alluser)

//ORDERS

router.get('/order',isAuth,orders);
router.get('/confirm/:id',isAuth,confirm);
router.get('/shipped/:id',isAuth,shipped);
router.get('/delivered/:id',isAuth,delivered);
router.get('/cancelled/:id',isAuth,cancelled);









module.exports = router;



