const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    image:{
        type:String,
   },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:1
    }

     

},{timestamps:true})
const productData= mongoose.model('product',productSchema)
module.exports=productData
