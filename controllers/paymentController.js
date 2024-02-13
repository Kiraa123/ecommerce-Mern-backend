const user = require("../helpers/userhelper");
const razorpay = require("../config/razorpay");
const order = require("../helpers/orderhelper");
const crypto = require("crypto");
module.exports = {
  placeorder: async (req, res) => {
    const userid = req.session.user._id;
    const email = req.session.user.email;
    const result = await user.getitemscart(userid);
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    orderID = `ORD-${timestamp}-${randomNum}`;
    if (result) {
      const orders = {
        orderID: orderID,
        orderdate: new Date(),
        username: email,
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        phoneno: req.body.phoneno,
        items: result.items,
        total: result.totalPrice,
        totalamount: result.totalPrice + 50,
        status: "Pending",
        paymentId: "null",
      };
      if (req.body.paymentMethod === "cod") {
        orders.status = "Placed";
        await user.orders(orders);
        await user.deletecartoredered(userid);
        res.json({ success: true });
      } else if (req.body.paymentMethod === "razorpay") {
        var order = await razorpay.payment(orderID, orders.totalamount);
        res.json(order);
      }
      await user.orders(orders);
      const newAddress = {
        userID: userid,
        addresses: {
          name: req.body.name,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          phoneno: req.body.phoneno,
        },
      };
      const existingAddress = await user.existaddress(newAddress,userid);
      if (!existingAddress) {
        await user.address(newAddress);
      }
      // res.json(order);
    }
  },
  paymentverify: async (req, res) => {
    const userid = req.session.user._id;
    const paymentId = req.body["payment[razorpay_payment_id]"];
    const orderId = req.body["payment[razorpay_order_id]"];
    const signature = req.body["payment[razorpay_signature]"];
    const orderID = req.body.orderID;
    const hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const hmachex = hmac.digest("hex");
    if (signature === hmachex) {
      await order.placed(orderID, paymentId);
      await order.updatequantity(orderID);
      await user.deletecartoredered(userid);

      res.json("success");
    } else {
      res.json("fail");
    }
  },
  success: (req, res) => {
    const orderid = req.params.id;
    res.render("users/success", { orderid });
  },
};
