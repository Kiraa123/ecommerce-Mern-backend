const order = require('../helpers/orderhelper')
const product = require('../helpers/producthelper')
const user = require('../helpers/userhelper')
const coupon=require('../helpers/couponhelper')

module.exports = {
    checkout: async (req, res) => {
        const userid = req.session.user._id;
        const count = await user.count(userid)
        if (count) {
            const data = await user.getitemscart(userid);
            const address1 = await user.addresstake(userid)
            if (address1 != '') {
                var address = address1[0].addresses
            }
            console.log(address,'aaa');
            console.log(address1,'bbb');


            total = data.totalPrice + 50
            res.render('users/checkout', { data, total, count, address})
        } else {
            res.redirect('/')
        }
    },

    cart: async (req, res) => {
        const currentuser = req.session.user.name;
        try {
            const userId = req.session.user._id;
            const data = await user.getitemscart(userId);
            const count = await user.count(userId);
            const allcoupon=await coupon.showcoupon(userId)
            const isUser=req.session.loggedIn;

            if (data) {
                total = data.totalPrice + 50
                res.render('users/cart', { data, total, count,coupon:allcoupon ,isUser})
            } else {
                res.render('users/cart',{isUser})
            }
        } catch (error) {
            console.error(error);
        }
    },
    coupon:async (req,res)=>{
        const userid = req.session.user._id;
        const result=await user.addcoupon(userid,req.body)
        const response = {
          totalPrice: result.discountprice
        };
        res.json(response)
      },
      removecoupon:async(req,res)=>{
        const userid = req.session.user._id;
        const result=await user.removecoupon(userid)
        res.redirect('/users/cart')
      },
    cartadding: async (req, res) => {
        var cartqty = 0
        const productid = req.params.id;
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
                      res.json(count + 1);
                }
                else {
                    await user.pushitems(userId, cartItem)
                      res.json(count + 1);
                }
            }
            else {
                await user.insertcart(userId, productid, cartItem)
                res.json(count + 1);
            }
        } else {
            var count = false
            res.json(count);
            return 1
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
        const username = req.session.user.name;
        const orders = await user.ordersfind(username)
        res.render('users/order', { data: orders })
    },
    shop: async (req, res) => {
        if (req.session.loggedIn) {
            const currentuser = req.session.user.name;
            const loggedInUser = await user.findexistuser(currentuser)
            const count = await user.countitems(loggedInUser._id)
            res.render('users/shop', { count })
        } else {

        }
    },
    qtyadd: async (req, res) => {
        const productid = req.params.id;
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
              res.json(response)
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
        res.render('admin/orders', { orders })
    },
   
    deletecart: async (req, res) => {
        const productid = req.params.id
        const userid = req.session.user._id;
        await user.deletecart(userid, productid);
        res.redirect('/users/cart')
    },
    confirm: async (req, res) => {
        const id = req.params.id;
        await order.updateStatus(id, 'Confirm');
        res.redirect('/admin/order');
    },
    shipped: async (req, res) => {
        const id = req.params.id;
        await order.updateStatus(id, 'Shipped');
        res.redirect('/admin/order');
    },
    cancelled: async (req, res) => {
        const id = req.params.id;
        await order.updateStatus(id, 'Cancelled');
        res.redirect('/admin/order');
    },
    delivered: async (req, res) => {
        const id = req.params.id;
        await order.updateStatus(id, 'Delivered');
        res.redirect('/admin/order');
    },









}

