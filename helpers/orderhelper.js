const Product = require('../models/productSchema')
const order = require('../models/orderSchema')
const product = require('../helpers/producthelper')
const Banner = require('../models/banner')

module.exports = {
    orders: async (req, res) => {
        const result = await order.find({ name: { $ne: null } }).sort({ orderdate: -1 }).lean()
        return result;
    },
    orders1: async (req, res) => {
        const result = await order.find({ name: { $ne: null } }).sort({ orderdate: -1 }).limit(10).lean()
        return result;
    },
    findorderid: async (data) => {
        try {
            const result = await order.find({ _id: data }).populate('items.product')
            return result
        } catch (error) {

        }
    },
    totalamount: async (req, res) => {
        var sum = await order.aggregate([
            {
                $group: {
                    _id: null, // Grouping by username
                    totalAmount: { $sum: "$totalamount" } // Calculating the sum of totalamount for each username
                }
            }
        ])
        return sum
    },
    placed: async (data, payment) => {
        await order.findOneAndUpdate(
            { orderID: data },
            { $set: { status: 'Placed', paymentID: payment } }
            , { new: true })

    },
    updateStatus: async (data, newStatus) => {
        const allowedTransitions = {
            Placed: ['Confirm', 'Cancelled', 'Shipped', 'Delivered'],
            Confirm: ['Shipped', 'Cancelled', 'Delivered'],
            Shipped: ['Delivered', 'Cancelled'],
            Delivered: [],
            Cancelled: [],
        };

        const currentOrder = await order.findById(data);

        if (!currentOrder) {
            return;
        }

        const validTransitions = allowedTransitions[currentOrder.status];

        if (!validTransitions || !validTransitions.includes(newStatus)) {
            return;
        }

        // Additional check to prevent transitioning from Placed to Shipped directly
        if (currentOrder.status === 'Placed' && newStatus === 'Shipped') {
            return;
        }

        // Perform the status update
        await order.findByIdAndUpdate(
            data,
            { $set: { status: newStatus } },
            { new: true }
        );

    },
    totalsum: async ()=>{
        const result = await order.aggregate([
          {
              $group: {
                  _id: null,
                  totalSum: { $sum: "$totalamount" }
              }
          }
      ]);
      const totalSum = result.length > 0 ? result[0].totalSum : 0;
      return totalSum;
      },
      monthlysum: async (thirtyDaysAgo)=>{
        const result = await order.aggregate([
          {
              $match: {
                  orderdate: { $gte: thirtyDaysAgo }
              }
          },
          {
              $group: {
                  _id: null,
                  totalSum: { $sum: "$totalamount" }
              }
          }
      ]);
      const sum = result.length > 0 ? result[0].totalSum : 0;
      return sum;
      },
      totalOD:async ()=>{
        const result = await order.aggregate([
          {
              $group: {
                  _id: null,
                  totalOrders: { $sum: 1 }
              }
          }
      ]);
      const totalOrders = result.length > 0 ? result[0].totalOrders : 0;
      return totalOrders;
      },
      deliveredOD:async ()=>{
        const result =await order.aggregate([
          {
            $match:{
              status: "Delivered"
            }
          },
          {
            $group:{
              _id:null,
              count:{$sum: 1 }
            }
          }
          
        ]);
        const deliveredOD = result.length > 0 ? result[0].count : 0;
        return deliveredOD;
      },
      placedOD:async ()=>{
        const result =await order.aggregate([
          {
            $match:{
              status:"Placed"
            }
          },
            {
              $group:{
                _id:null,
                count:{$sum:1}
              }
            }
          
        ])
        const placedOD = result.length > 0 ? result[0].count : 0;
        return placedOD
      },
      cancelledOD:async()=>{
        const result = await order.aggregate([
          {
            $match:{
              status:"Cancelled"
            }
          },
          {
            $group:{
              _id:null,
              count:{$sum:1}
            }
          }
        ])
        const cancelledOD = result.length > 0 ? result[0].count : 0;
        return cancelledOD;
      
      },
    // monthtotal: async () => {
    //     try {
    //         const result = await order.aggregate([
    //             {
    //                 $group: {
    //                     _id: {
    //                         year: { $year: "$orderdate" },
    //                         month: { $month: "$orderdate" }
    //                     },
    //                     totalMonthlyPrice: { $sum: "$totalamount" }
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 0,
    //                     year: "$_id.year",
    //                     month: "$_id.month",
    //                     totalMonthlyPrice: 1
    //                 }
    //             },
    //             {
    //                 $sort: {
    //                     year: 1,
    //                     month: 1
    //                 }
    //             }
    //         ]);


    //         // Create an array of all months (1-12)
    //         const allMonths = [...Array(12).keys()].map(month => month + 1);

    //         // Create an array to hold the final result
    //         const finalResult = allMonths.map(month => {
    //             const monthData = result.find(item => item.month === month);
    //             return monthData ? monthData : { month, totalMonthlyPrice: 0 };
    //         });

    //         return finalResult;
    //     } catch (error) {
    //         console.error("Error occurred while fetching month totals:", error);
    //         throw error;
    //     }
    // },





    totalorderedcount: async () => {
        const result = await order.aggregate([{
            $match: {
                status: { $ne: ['Pending', 'Cancelled'] }
            }

        },
        {
            $group: {
                _id: null,
                totalOrderedQty: { $sum: '$items.quantity' },
                totalAvgQty: { $avg: '$items.quantity' },
                totalamount: { $sum: '$total' },
                totalamountAvg: { $avg: '$total' }
            }
        }
        ])
        return result;
    },
   
    currentorder: async () => {
        const result = await Product.aggregate([{
            $group: {
                _id: null,
                totalqty: { $sum: '$quantity' }
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
            await Product.findOneAndUpdate({ _id: productId }, { $inc: { quantity: -orderedQuantity } }, { new: true });
        }
    },
    filterorder: async function (low, high) {
        const orders = await order.find({ totalamount: { $gt: low, $lt: high } }).populate('orderID').lean()
        return orders;
    },

    filterOrderType: async function (payType) {
        const orders = await order.find({ paymentID: payType }).populate('orderID').lean()
        return orders;
    },
    filterOrderStatus: async function (status1) {
        const orders = await order.find({ status: status1 }).populate('orderID').lean()
        return orders;
    },
    findbanner: async (bannerid) => {
        const result = await Banner.findOne({ _id: bannerid }).lean()
        return result;
    },
    editbanner: async (data, proid) => {
        const result = await Banner.updateOne({ _id: proid }, {
            $set:
            {
                bannerTitle: data.bannerTitle,
                bannerImage: data.bannerImage,
                bannerDescription: data.bannerDescription,
                onProducts: data.onProducts
            }
        }, { new: true });
        return result;
    },
    deletebanner: async (data) => {
        await Banner.deleteOne({ _id: data })
    },


}