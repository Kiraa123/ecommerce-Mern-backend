
const Product=require('../models/productSchema')
const product=require('../helpers/producthelper')
var path=require('path')

module.exports={
    addproductpage:async (req, res, next)=> {
    res.render('admin/addproduct');
  },
    addProduct:async(req,res)=>{
        console.log(req.body);
        const image=req.body.image
        const Image=req.body.image=path.basename(req.file.filename)
        const data={
            productname:req.body.productname,
            category:req.body.category,
            price:req.body.price,
            quantity:req.body.quantity,
            image:Image
        }
        
        await Product.insertMany(data);
        res.redirect('/admin/products')
    },
    allproducts:async(req,res)=>{
        const data=await product.allproducts();
        res.render('admin/allproducts',{data:data})
    },

    productdetails:async(req,res)=>{
        const id=req.params.id
        const order=await order.findorderid(id)
        res.render('admin/product_details',{order})
    },
    editproduct:async(req,res)=>{
        const id=req.params.id
        const data=await product.finddata(id)
        res.render('admin/editproduct',{data})
    },
       
}