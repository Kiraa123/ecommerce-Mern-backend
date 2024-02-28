const order = require('../helpers/orderhelper')
const product = require('../helpers/producthelper')
const user = require('../helpers/userhelper')
const coupon = require('../helpers/couponhelper')

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

            newtotal = data.discountprice + 50;
            total = data.totalPrice + 50
            res.render('users/checkout', { data, newtotal, total, count, address, coupon })
        } else {
            res.redirect('/')
        }
    },


    cart: async (req, res) => {
        let data;
        // const currentuser = req.session.user.name;
        if (req.session.user) {
            try {
                const userId = req.session.user._id;
                data = await user.getitemscart(userId);
                const count = await user.count(userId);
                const isCart = req.session.loggedIn || false;

                console.log(data);
                if (data) {
                    const allcoupon = await coupon.showcoupon(userId)
                    const appliedCoupon = await user.getitemscart(userId)
                    if (appliedCoupon.isCoupon == true) {
                        total = data.discountprice + 50

                        console.log(data.discountprice)
                        res.render('users/cart', { data, total, count, coupon: allcoupon, isCart })

                    } else {
                        total = data.totalPrice + 50
                        res.render('users/cart', { data, total, count, coupon: allcoupon, isCart})
                    }

                } else {
                    res.render('users/cart')
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            const isUser = false;
            data = req.session.guest || [];
            const format = { items: data }
            const count = data.length;
            const totalPrice=req.session.totalPrice;

            res.render('users/cart', { data: format, count,totalPrice });

        }
    },
    coupon: async (req, res) => {
        const userid = req.session.user._id;
        const result = await user.addcoupon(userid, req.body)
        const response = {
            totalPrice: result.discountprice
        };
        res.json(response)
    },
    removecoupon: async (req, res) => {
        const userid = req.session.user._id;
        const result = await user.removecoupon(userid)
        res.redirect('/users/cart')
    },
    cartadding: async (req, res) => {
        const productid = req.params.id;
        const Product = await product.finddata(productid);
        if (req.session.user) {
            var cartqty = 0
            const userId = req.session.user._id || null;
            const cart = await user.cartexist(userId)
            const productexist = await user.productexist(productid, userId)

            if (productexist) {
                var foundItem = productexist.items.find(item => item.product.toString() === productid);
                cartqty = foundItem.quantity

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
            }
        } else {

            req.session.guest = req.session.guest || [];
            const productid = req.params.id;


            const existingCartItem = req.session.guest.find(item => item.product === productid);

            if (existingCartItem) {
                // Product already exists in the guest cart, update the quantity
                existingCartItem.quantity += (req.query.quantity || 1);
            } else {
                // Product doesn't exist, add a new entry
                const quantity = req.query.quantity || 1;
                const size = req.query.size || 'M';
                const product = {
                    product: productid,
                    quantity: quantity,
                    size: size,
                    image: Product.image,
                    name: Product.productname,
                    price: Product.price
                }
                product.totalPrice = product.quantity * product.price;
                req.session.guest.push(product);
                // req.session.guest.push({
                //     product: productid,
                //     quantity: quantity,
                //     size: size,
                //     image: Product.image,
                //     name: Product.productname,
                //     price:Product.price
                // });
                // console.log(req.session.guest);
            }
            req.session.totalPrice = req.session.guest.reduce((total, item) => total + item.totalPrice, 0);
            const count = req.session.guest.reduce((total, item) => total + item.quantity, 0);
            res.json({
                count,
                totalPrice: req.session.totalPrice
            });
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
        const cart = await user.cartexist(userid)
        if (cart.discountprice) {
            const response = "coupon";
            res.json(response)
        } else {
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
                    totalPrice: cart.totalPrice,
                    availableCoupons: await getAvailableCoupons(cart.totalPrice, userid)

                };
                res.json(response)
            }
            else {
                const response = false;
                res.json(response)
            }
        }
        async function getAvailableCoupons(totalPrice, userid) {
            if (totalPrice >= 20000 && totalPrice <= 80000) {
                const allcoupon = await coupon.showcoupon(userid);
                return allcoupon;
            } else {
                return 1;
            }
        }
    },
    qtyminus: async (req, res) => {
        const productid = req.params.id;

        const currentuser = req.session.user.name;
        const userid = req.session.user._id;
        const quantity = await user.quantity(userid, productid);
        const cart = await user.cartexist(userid);

        if (cart.discountprice) {
            const response = "coupon";
            res.json(response);
        } else if (quantity > 0) {
            const updatedCart = await user.qtyminus(userid, productid);
            const response = {
                quantity: quantity,
                totalPrice: updatedCart.totalPrice,
                availableCoupons: await getAvailableCoupons(cart.totalPrice, userid)
            };
            res.json(response);
        }


        async function getAvailableCoupons(totalPrice, userid) {
            if (totalPrice >= 20000 && totalPrice <= 80000) {
                const allcoupon = await coupon.showcoupon(userid);
                return allcoupon;
            } else {
                return 1;
            }
        }
    },

    orders: async (req, res) => {
        const orders = await order.orders()
        res.render('admin/orders', { orders })
    },

    deletecart: async (req, res) => {
        const productid = req.params.id
        const userid = req.session.user._id;
        const data = await user.getitemscart(userid);
        if (data.discountprice) {
            const response = "coupon";
            res.json(response)
        }
        else {
            const cart = await user.deletecart(userid, productid);
            const count1 = await user.count(userid)
            const response = {
                count: count1,
                totalPrice: cart.totalPrice
            };
            res.json(response)
        }
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

