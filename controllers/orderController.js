const order = require('../helpers/orderhelper')
const product = require('../helpers/producthelper')
const user = require('../helpers/userhelper')
const Product = require('../models/productSchema')
const User = require('../models/userSchema')
const cart = require('../models/cartSchema')

module.exports = {

    updateOrder: async (req, res) => {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(400).json({ msg: "No order with this id" })
        }
        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ msg: 'The order has already been delivered' });

        }
        if (req.body.status === 'shipped') {

        }


    },
    //delete order--Admin
    deleteOrder: async (req, res) => {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(400).json({ msg: "No order with this id" })
        }
        await order.remove();
        return res.status(400).json({ msg: "order removed" })
    },
    checkout: async (req, res) => {
        const orderId = req.query.orderId;
        const currentuser = req.session.user.name;
        const userid = req.session.user._id;
        const data = await user.getitemscart(userid)
        const count = await user.count(userid)
        if (count) {
            total = data.totalPrice + 50
            res.render('users/checkout', { total, data })
        } else {
            res.redirect('/users/product')
        }
    },

    cart: async (req, res) => {
        const currentuser = req.session.user.name;
        try {
            const userId = req.session.user._id;
            const data = await user.getitemscart(userId);
            const count = await user.count(userId);
            console.log(count);

            if (data) {
                total = data.totalPrice + 50
                res.render('users/cart', { data, total, count })
            } else {
                res.render('users/cart')
            }
        } catch (error) {
            console.error(error);
        }
    },
    add: async (req, res) => {


    },
    cartadding: async (req, res) => {
        var cartqty = 0
        const productid = req.params.id;
        const currentuser = req.session.user.name;
        const userId = req.session.user._id;
        const cart = await user.cartexist(userId)
        const productexist = await user.productexist(productid, userId)

        if (productexist) {
            var foundItem = productexist.items.find(item => item.product.toString() === productid);
            var cartqty = foundItem.quantity

        }
        const productqty = await product.finddata(productid)

        if (productqty.quantity > cartqty) {
            const quantity = req.query.quantity || 1;
            const size = req.query.size || 'M';
            const cartItem = {
                product: productid,
                quantity: quantity,
                size: size,
            };
            count = await user.countitems(userId)
            if (cart) {
                if (productexist) {
                    await user.updatecart(userId, cartItem)
                    //   res.json(count + 1);
                }
                else {
                    await user.pushitems(userId, cartItem)

                    //   res.json(count + 1);
                }
            }
            else {
                await user.insertcart(userId, productid, cartItem)

                // res.json(count + 1);
            }
        } else {
            var count = false
            res.json(count);
        }
    },

    success: async (req, res) => {
        const orderid = req.params.orderid;
        res.render('/users/success', { orderid })
    },
    changepassword: async (req, res) => {
        res.render('users/changepasssword')
    },
    quantityupdate: async (order) => {
        const result = await order.updatequantity(order)
    },
    order: async (req, res) => {
        const currentuser = req.session.user;
        const username = currentuser.username;
        const orders = await user.ordersFind(username)
        res.render('users/order', { data: orders })
    },
    shop: async (req, res) => {
        if (req.sessiom.loggedIn) {
            const currentuser = req.session.user;
            const loggedInUser = await user.findexistuser(currentuser.username)
            const count = await user.countitems(loggedInUser._id)
            res.render('users/shop', { count })
        } else {

        }
    },
    qtyadd: async (req, res) => {
        const productid = req.params.id;
        console.log(productid,'iiiiii');
        const currentuser = req.session.user.name;
        const userid = req.session.user._id;
        const quantity = await user.quantity(userid, productid)
        console.log(quantity);
        const productexist = await user.productexist(productid, userid)
        if (productexist) {
          var foundItem = productexist.items.find(item => item.product.toString() === productid);
          var cartqty = foundItem.quantity
        }
        const productqty = await product.finddata(productid)
        if (productqty.quantity > cartqty) {
          const cart = await user.qtyadd(userid, productid)
          const response = {
            quantity: quantity,
            totalPrice: cart.totalPrice
          };
        //   res.json(response)
        } else {
          const response = false;
          res.json(response)
        }
      },
      qtyminus: async (req, res) => {
        const productid = req.params.id;
        const currentuser = req.session.user.name;
        const userid = req.session.user._id;
        const quantity = await user.quantity(userid, productid)
        if (quantity > 0) {
          const cart = await user.qtyminus(userid, productid)
          const response = {
            quantity: quantity,
            totalPrice: cart.totalPrice
          };
          res.json(response)
        }
      },
    orders: async (req, res) => {
        const orders = await order.orders()
        res.render('admin/order', { orders })
    },
    deletecart: async (req, res) => {
        const productid = req.params.id
        const currentuser = req.session.user.name;
        const userid = req.session.user._id;
        await user.deletecart(userid, productid);
        res.redirect('/users/cart')
      },
    confirm: async (req, res) => {
        const id = req.params.id
        const result = await order.confirm(id)
        res.redirect('/admin/order')
    },
    shipped: async (req, res) => {
        const resslt = await order.shipped(id)
        res.render('admin/order')
    },
    cancelled: async (req, res) => {
        const id = req.params.id
        const result = await order.cancelled(id)
        res.redirect('/admin/order')
    },
    delivered: async (req, res) => {
        const id = req.params.id
        const result = await order.delivered(id);
        res.redirect('/admin/order')
    }









}

