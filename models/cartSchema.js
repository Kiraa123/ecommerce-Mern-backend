const mongoose=require('mongoose')
const cartItemSchema=new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default : 1
    },size:{
        type:String,
        enum:['S','M','L']

    }

});

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        // required:true
    },
    items:[cartItemSchema],
    totalPrice:{
        type:Number,
        default:0
    }
})
const Cart=mongoose.model('Cart',cartSchema)
module.exports=Cart;