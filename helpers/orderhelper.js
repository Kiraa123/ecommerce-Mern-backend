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
    updateStatus: async (data, newStatus) => {
        const allowedTransitions = {
            Placed: ['Confirm', 'Cancelled','Shipped','Delivered'],
            Confirm: ['Shipped', 'Cancelled','Delivered'],
            Shipped: ['Delivered', 'Cancelled'],
            Delivered: [],
            Cancelled: [],
        };
    
        const currentOrder = await order.findById(data);
    
        if (!currentOrder) {
            console.error(`Order with id ${data} not found`);
            return;
        }
    
        const validTransitions = allowedTransitions[currentOrder.status];
        console.log(validTransitions,'kaana');
    
        if (!validTransitions || !validTransitions.includes(newStatus)) {
            console.error(`Invalid status transition from ${currentOrder.status} to ${newStatus}`);
            return;
        }
    
        // Additional check to prevent transitioning from Placed to Shipped directly
        if (currentOrder.status === 'Placed' && newStatus === 'Shipped') {
            console.error(`Invalid status transition from ${currentOrder.status} to Shipped`);
            return;
        }
    
        // Perform the status update
        await order.findByIdAndUpdate(
            data,
            { $set: { status: newStatus } },
            { new: true }
        );
    
        // Log after status update for debugging
        console.log(`After status update: ${newStatus}`);
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
            await Product.findOneAndUpdate({ _id: productId },{$inc: { qty: -orderedQuantity }},{ new: true });
        }
    },
    // invoice: async (orderid) => {
    //     const details = await order.findOne({ orderID: orderid }).populate('items.product').lean();
    //     return details
    // },
    filterorder: async function(low, high){
        const orders = await order.find({totalamount: {$gt: low, $lt: high}}).populate('orderID').lean()
        return orders;
      },
    
      filterOrderType: async function(payType){
        const orders = await order.find({paymentID: payType}).populate('orderID').lean()
          return orders;
      },
      filterOrderStatus: async function(status1){
        const orders = await order.find({status: status1}).populate('orderID').lean()
          return orders;
      }
}