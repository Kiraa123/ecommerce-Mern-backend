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
        const result = await order.find({ name: { $ne: null } }).sort({ orderdate: -1 }).limit (10).lean()
        return result;
    },
    findorderid: async (data) => {
        try {
            const result = await order.find({ _id: data }).populate('items.product')
            return result
        } catch (error) {

        }
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
            }
        }, { new: true });
        console.log('result',result);
        return result;
    },
    deletebanner: async (data) => {
        await Banner.deleteOne({ _id: data })
    },


}