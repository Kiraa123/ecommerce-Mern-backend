const mongoose=require('mongoose')
// const url='mongodb://localhost:27017/test'
// const connect =mongoose.connect(url)
// connect.then(()=>{
//     console.log('success');
// })
// .catch (()=>{
//     console.log('error');
// })
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
        maxLength:[6,'price cannot exceed 6 characters']
    },
    category:{
        type:String,
        required:[true,'please enter product category']
    },
    quantity:{
        type:Number,
        default:1
    }

     

},{timestamps:true})
const productData= mongoose.model('product',productSchema)
module.exports=productData
