const mongoose=require('mongoose')
const wishlistItemSchema=new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    }
});

const wishlistItem=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        // required:true
    },
    items:[wishlistItemSchema],
})
const wishlist=mongoose.model('wishlist',wishlistItem)
module.exports=wishlist;