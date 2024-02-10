const coupon=require('../models/coupon')

module.exports={
    addcoupon:async(data)=>{
        await coupon.insertMany(data)
    },
    showcoupon:async()=>{
        const result=await coupon.find({}).lean()
        return result
    },
}