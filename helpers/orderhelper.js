const Product = require('../models/productSchema')
const order = require('../models/orderSchema')
const product=require('../helpers/producthelper')

module.exports = {
    orders: async (req, res) => {
        const result = await order.find({ name: { $ne: null } }).sort({ createdAt: -1 }).lean()
        return result;
    },
    findorderid: async (data) => {
        try {
            const result = await order.find({ _id: data }).populate('items.product')
            return result
        } catch (error) {
            console.log("Error in finding Order ID", error);

        }
    },
    placed: async (data,payment) => {
        await order.findOneAndUpdate(
            {orderID:data},
            {$set:{status:'Placed',paymentID:payment}}
            ,{new:true} )

    },
    confirm: async (data) => {
        await order.findOneAndUpdate(
            { _id: data },
            {
                $set:
                {
                    status: 'Confirm'
                }
            },{new:true})
    },
    shipped: async (data) => {
        await order.findOneAndUpdate(
            { _id: data },
            {
                $set:
                {
                    status: 'Shipped'
                }
            },{new:true})
    },
    delivered: async (data) => {
        await order.findOneAndUpdate(
            { _id: data },
            {
                $set:
                {
                    status: 'Delivered'
                }
            },{new:true})
    },
    cancelled: async (data) => {
        await order.findOneAndUpdate(
            { _id: data },
            {
                $set:
                {
                    status: 'Cancelled'
                }
            },{new:true})
    },
    totalorderedcount:async()=>{
        const result=await order.aggregate([{
            $match:{
                status:{$ne:['Pending','Cancelled']}
            }

        },
        {$group:{
            _id:null,
            totalOrderedQty:{$sum:'$items.quantity'},
            totalAvgQty:{$avg:'$items.quantity'},
            totalamount:{$sum:'$total'},
            totalamountAvg:{$avg:'$total'}
        }}
    ])
    return result;
    },
    currentorder:async ()=>{
        const result=await Product.aggregate([{
            $group:{
                _id:null,
                totalqty:{$sum:'$quantity'}
            }

        }])
        // return result[0].totalqty;
        return result;
    },
    updatequantity: async (orderid) => {
        const details = await order.findOne({ orderID: orderid }).populate('items.product').lean();
        const orderItems = details.items; // Assuming 'items' is an array of { product: productId, quantity }
        for (const orderItem of orderItems) {
            const productId = orderItem.product._id;
            const orderedQuantity = orderItem.quantity;
            await Product.findOneAndUpdate(
                { _id: productId },
                {
                    $inc: { qty: -orderedQuantity }
                },
                { new: true }
            );
        }
    },
    invoice: async (orderid) => {
        const details = await order.findOne({ orderID: orderid }).populate('items.product').lean();
        return details
    },
    
    
       

}