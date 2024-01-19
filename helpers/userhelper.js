const user = require('../models/userSchema')
const product = require('../helpers/producthelper')
const deleteuser = require('../models/deleteUser')
const cart = require('../models/cartSchema')
const Product = require('../models/productSchema')
const order = require('../models/orderSchema')
const address=require('../models/addressSchema')

module.exports = ({
    edituser: async (data,productid) => {
        const result = await user.updateOne({ _id:productid }, {
            $set:
            {
                name: data.name,
                email: data.email,
                password: data.password,
                address: data.address,
                phone: data.phone,
                city: data.city
            }
        });
        return result;
    },
    deletecartorder: async (userid) => {
        await cart.findOneAndDelete({ user: userid });

    },
    orders: async (data) => {
        const result = await order.insertMany(data)
        return result;

    },
    finduser: async (data) => {
        var result = await user.find({}).lean()
        return result;
    },
    finduserid: async (data) => {
        var result = await user.findOne({ _id: data }).lean()
        return result;
    },
    searchuser: async (data) => {
        const result = await user.find({ name: { $regex: `^${data}`, $optionss: 'i' } })
        return result;
    },
    findexistuser: async (data) => {
        const result = await user.findOne({ email: data }).lean()
        console.log(result);
        return result;
    },
    findedituserbyid: async (data) => {
        const result = await user.findOne({ _id: data }).lean()
        console.log(result);
        return result;
    },
    insertdelete: async (data) => {
        const result = await deleteuser.insertMany(data);
        return result;
    },
    delete: async (data) => {
        await user.deleteOne({ _id: data });
    },
    getitemscart: async (data) => {
        const result = await cart.findOne({ user: data }).populate('items.product').lean();
        return result
    },
    cartexist: async (data) => {
        const result = await cart.findOne({ user: data })
        return result
    },
    productexist: async (data, userid) => {
        const result = await cart.findOne({ user: userid, 'items.product': data })
        return result
    },
    blockuser: async (data) => {
        await user.updateOne({ _id: data }, { $set: { status: 'block' } })
    },
    unblockuser: async (data) => {
        await user.updateOne({ _id: data }, { $unset: { status: 1 } })
    },
    countitems: async (userid) => {
        const result = await cart.findOne({ user: userid })
        if (result) {
            const count = result.items.reduce((total, item) => total + item.quantity, 0);
            return count;
        }
        else return 0
    },


    quantity: async (userid, data) => {
        const result = await Product.findOne({_id:data});
        console.log('result:', result);

        const currentCartItem = await cart.findOne(
            { user: userid, 'items.product': data },
            { items: { $elemMatch: { product: data } } }
        );
        // console.log('result:', result);
        // console.log('result:', currentCartItem);

        const quantity = currentCartItem.items[0].quantity - 1;
        return quantity
    },
    updatecart: async (userid, data) => {
        const productPrice = await product.finddata(data.product);
        console.log('price:', productPrice);

        const newTotalPrice = 1 * productPrice.price;
        const updatedCart = await cart.findOneAndUpdate(
            { user: userid, 'items.product': data.product },
            {
                $inc: { 'items.$.quantity': 1, totalPrice: newTotalPrice },
            },
            { new: true }
        );


    },
    count: async (userid) => {
        const result = await cart.findOne({ user: userid })
        if (result) {
            const count = result.items.length
            return count
        } else {
            return 0
        }
    },
    pushitems: async (userid, data) => {
        var price = await product.finddata(data.product)
        var totprice = data.quantity * price.price
        await cart.findOneAndUpdate(
            { user: userid },
            {
                $push: { items: data },
                $inc: { totalPrice: totprice }
            },
            { new: true }
        );

    },
    insertcart: async (userid, proid, cartItem) => {
        var price = await product.finddata(proid)

        var totprice = cartItem.quantity * price.price
        datas = {
            user: userid,
            items: [cartItem],
            totalPrice: totprice,
        }
        await cart.insertMany(datas)
    },
    qtyadd: async (userid, data) => {
        const productPrice = await product.finddata(data);
        const newTotalPrice = 1 * productPrice.price;
        const updatedCart = await cart.findOneAndUpdate(
            { user: userid, 'items.product': data },
            {
                $inc: { 'items.$.quantity': 1, totalPrice: newTotalPrice },
            },
            { new: true }
        );
        return updatedCart
    },
    qtyminus: async (userid, data) => {
        const productPrice = await product.finddata(data);
        const newTotalPrice = 1 * productPrice.price;
        const updatedCart = await cart.findOneAndUpdate(
            { user: userid, 'items.product': data },
            {
                $inc: { 'items.$.quantity': -1, totalPrice: -newTotalPrice },
            },
            { new: true }
        );
        return updatedCart
    },
    deletecart: async (userid, data) => {
        const productPrice = await product.finddata(data);
        const currentCartItem = await cart.findOne(
            { user: userid, 'items.product': data },
            { items: { $elemMatch: { product: data } } }
        );
        const quantity = currentCartItem.items[0].quantity;
        const totprice = quantity * productPrice.price
        await cart.findOneAndUpdate(
            { user: userid },
            {
                $pull: { items: { product: data } },
                $inc: { totalPrice: -totprice }
            },
            { new: true }
        );
        const result = await cart.findOne({ user: userid })
        if (result.items.length == 0) {
            await cart.findOneAndDelete({ user: userid });
        }
    },
    address: async (data) => {
        await address.insertMany(data)
        //add
    },
    addresstake: async (id) => {
        const result = await address.find({ userid: id }).lean()
        return result
    },

})







