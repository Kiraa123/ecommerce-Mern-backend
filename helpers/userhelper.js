const user = require("../models/userSchema");
const product = require("../helpers/producthelper");
const deleteuser = require("../models/deleteUser");
const cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const order = require("../models/orderSchema");
const address = require("../models/addressSchema");
const nodemailer = require("nodemailer");
const wishlist = require("../models/wishlist");

module.exports = {
  createUser: async (data) => {
    const newUser = await user.insertMany({
      name: data.name,
      email: data.email,
      password: data.password,
      verification: data.verification,
      // address: data.address,
      // phone: data.phone,
      // city: data.city
    });
    return newUser;
  },

  finduseremail: async (data) => {
    var result = await user.findOne({ email: data });
    return result;
  },

  edituser: async (data, productid) => {
    const result = await user.updateOne(
      { _id: productid },
      {
        $set: {
          name: data.name,
          email: data.email,
          address: data.address,
          phone: data.phone,
          city: data.city,
        },
      }
    );
    return result;
  },
  addcoupon:async(userid,data)=>{
    let cartprice = await cart.findOne({ user: userid });
    if (!cart) {
        throw new Error('Cart not found for the user');
    }
    const discountPrice = cartprice.totalPrice-(cartprice.totalPrice * (data.discount / 100));
    const result = await cart.findOneAndUpdate(
        { user: userid },
        {
            $set: { coupencode:data.code,
                discount: data.discount,
                discountprice: discountPrice },
        },
        { new: true }
    );
    return result
},
  verified: async (data) => {
    await user.updateOne({ _id: data }, { $set: { verification: true } });
  },
  deletecartoredered: async (userid) => {
    await cart.findOneAndDelete({ user: userid });
  },
  forgotpassword: async (email1, password1) => {
    await user.updateOne({ email: email1 }, { $set: { password: password1 } });
  },
  orders: async (data) => {
    const result = await order.insertMany(data);
    return result;
  },
  gmail: async (email, name) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: "kiranprakash970@gmail.com",
      to: email,
      subject: "Welcome " + name,
      text: "Enjoy Your Shopping ",
    };
    transporter.sendMail(mailOptions, function (error, info) {});
  },
  finduser: async (data) => {
    var result = await user.find({}).lean();
    return result;
  },
  ordersfind: async (data) => {
    const result = await order.find({ username: data }).populate("items.product").lean();
    return result;
  },
  finduserid: async (data) => {
    var result = await user.findOne({ _id: data }).lean();
    return result;
  },
  searchuser: async (data) => {
    const result = await user.find({
      name: { $regex: `^${data}`, $optionss: "i" },
    });
    return result;
  },
  findexistuser: async (data) => {
    const result = await user.findOne({ name: data }).lean();
    return result;
  },
  findedituserbyid: async (data) => {
    const result = await user.findOne({ _id: data }).lean();
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
    const result = await cart.findOne({ user: data }).populate("items.product").lean();
    return result;
  },
  cartexist: async (data) => {
    const result = await cart.findOne({ user: data });
    return result;
  },
  productexist: async (data, userid) => {
    const result = await cart.findOne({ user: userid, "items.product": data });
    return result;
  },
  getwishlist: async (data) => {
    const wishlists = await wishlist.findOne({ user: data }).populate("items.product").lean();
    return wishlists;
  },
  wishlistAdd: async (userid, proid) => {
    const existwishlist = await wishlist.findOne({ user: userid });
    let result;
    if (existwishlist) {
      const productexist = await wishlist.findOne({ user: userid , "items.product": proid} );
      if (productexist) {
        result = await wishlist.findOneAndUpdate(
          { user: userid },
          { $pull: { items: { product: proid } } },
          { new: true }
        );
      } else {
        result = await wishlist.findOneAndUpdate(
          { user: userid },
          { $push: { items: { product:proid } } },
          { new: true }
        );
      }
    } else {
      result = await wishlist.insertMany({
        user: userid,
        items: [{ product: proid }],
      });

    }
    return result;

  },
  wishlistdelete: async (userid, proid) => {
    const deletewishlist = await wishlist.updateOne(
      { _id: userid },
      { $pull: { wishlist: { product: proid } } },
      { new: true }
    );
    const user = await wishlist.findOne({ _id: userid });
    return deletewishlist;
  },
  blockuser: async (data) => {
    await user.updateOne({ _id: data }, { $set: { status: "block" } });
  },
  unblockuser: async (data) => {
    await user.updateOne({ _id: data }, { $unset: { status: 1 } });
  },
  countitems: async (userid) => {
    const result = await cart.findOne({ user: userid });
    if (result) {
      const count = result.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      return count;
    } else return 0;
  },

  quantity: async (userid, data) => {
    const result = await Product.findOne({ _id: data });
    console.log("result:", result);

    const currentCartItem = await cart.findOne(
      { user: userid, "items.product": data },
      { items: { $elemMatch: { product: data } } }
    );
    // console.log('result:', currentCartItem);

    const quantity = currentCartItem.items[0].quantity - 1;
    return quantity;
  },
  updatecart: async (userid, data) => {
    const productPrice = await product.finddata(data.product);
    console.log("price:", productPrice);

    const newTotalPrice = 1 * productPrice.price;
    const updatedCart = await cart.findOneAndUpdate(
      { user: userid, "items.product": data.product },
      {
        $inc: { "items.$.quantity": 1, totalPrice: newTotalPrice },
      },
      { new: true }
    );
  },
  count: async (userid) => {
    const result = await cart.findOne({ user: userid });
    if (result) {
      const count = result.items.length;
      return count;
    } else {
      return 0;
    }
  },
  pushitems: async (userid, data) => {
    var price = await product.finddata(data.product);
    var totprice = data.quantity * price.price;
    await cart.findOneAndUpdate(
      { user: userid },
      {
        $push: { items: data },
        $inc: { totalPrice: totprice },
      },
      { new: true }
    );
    // res.redirect('/users/cart')
  },
  insertcart: async (userid, proid, cartItem) => {
    var price = await product.finddata(proid);

    var totprice = cartItem.quantity * price.price;
    datas = {
      user: userid,
      items: [cartItem],
      totalPrice: totprice,
    };
    await cart.insertMany(datas);
  },
  qtyadd: async (userid, data) => {
    const productPrice = await product.finddata(data);
    const newTotalPrice = 1 * productPrice.price;
    const updatedCart = await cart.findOneAndUpdate(
      { user: userid, "items.product": data },
      {
        $inc: { "items.$.quantity": 1, totalPrice: newTotalPrice },
      },
      { new: true }
    );
    return updatedCart;
  },
  qtyminus: async (userid, data) => {
    const productPrice = await product.finddata(data);
    const newTotalPrice = 1 * productPrice.price;
    const updatedCart = await cart.findOneAndUpdate(
      { user: userid, "items.product": data },
      {
        $inc: { "items.$.quantity": -1, totalPrice: -newTotalPrice },
      },
      { new: true }
    );
    return updatedCart;
  },
  deletecart: async (userid, data) => {
    const productPrice = await product.finddata(data);
    const currentCartItem = await cart.findOne(
      { user: userid, "items.product": data },
      { items: { $elemMatch: { product: data } } }
    );
    const quantity = currentCartItem.items[0].quantity;
    const totprice = quantity * productPrice.price;
    await cart.findOneAndUpdate(
      { user: userid },
      {
        $pull: { items: { product: data } },
        $inc: { totalPrice: -totprice },
      },
      { new: true }
    );
    const result = await cart.findOne({ user: userid });
    if (result.items.length == 0) {
      await cart.findOneAndDelete({ user: userid });
    }
  },
  updatepassword: async (user1, data) => {
    await user.findOneAndUpdate(
      { name: user1 },
      {
        $set: { password: data },
      }
    );
  },
  address: async (data) => {
    await address.insertMany(data);
  },
  existaddress: async (data) => {
    const existingAddress = await address.findOne({
      userID: data.userID,
      "addresses.name": data.addresses.name,
      "addresses.city": data.addresses.city,
      "addresses.pincode": data.addresses.pincode,
    });
    return existingAddress;
  },
  addresstake: async (id) => {
    const result = await address.find({userID:id }).lean();
    console.log(result,'asd');
    return result;
  },
};
