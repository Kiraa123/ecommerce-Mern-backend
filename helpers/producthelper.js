const user=require('../models/userSchema')
const product=require('../models/productSchema')
const cart=require('../models/cartSchema')
module.exports={
    finddata:async(data)=>{
         var result=await product.findOne({_id:data}).lean();
         return result
    },
    insertdata:async(data)=>{
        var result=await product.insertMany(data);
        return result
    },
    allproducts:async(data)=>{
        var result = await product.find({}).lean();
        return result
    },
    allproducts1:async(data)=>{
        var result = await product.find().limit(9).lean();
        return result
    },
    allproducts2:async(data)=>{
        var result = await product.find().skip(9).limit(9).lean();
        return result
    },
    allproducts3:async(data)=>{
        var result = await product.find().skip(18).limit(9).lean();
        return result
    },
    deleteproduct:async(data)=>{
        await product.deleteOne({_id : data})
    },
    addcart:async(user,data)=>{
        await cart.create(user,data)

    },
    search:async()=>{
        const data=await product.find({name:{$regex:`^${word}`,$optionss:'i'}})
    },
    category:async(data)=>{
        const category=await product.find({category:data})
        return category
    },
     editproduct: async (data, productid) => {
        const result = await product.updateOne({ _id: productid }, {
            $set:
            {
                productname: data.productname,
                image: data.image,
                description: data.description,
                price: data.price,
                category: data.category,
                quantity: data.quantity,
            }
        },{new:true});
    },
}