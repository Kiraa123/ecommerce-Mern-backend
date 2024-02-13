const coupon=require('../models/coupon')
const user = require('../helpers/userhelper')

module.exports={
    addcoupon:async(data)=>{
        await coupon.insertMany(data)
    },
    showcoupon:async(userId)=>{
        const cart=await user.getitemscart(userId);
        console.log('lllll',cart)
        const result = await coupon.find({
            minPriceRange: { $lte: cart.totalPrice },
            maxPriceRange: { $gte: cart.totalPrice },
        }).lean();
        console.log(result,'iiiii');
        return result
    },
    showallcoupon:async()=>{
        const result=await coupon.find({}).lean()
        return result
    },
}