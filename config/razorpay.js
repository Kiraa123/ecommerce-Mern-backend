const Razorpay = require('razorpay')

var instance = new Razorpay({
    key_id: 'rzp_test_tnX1UxDN9JUK6D',
    key_secret:'4cre4C05X6ABHKooi0Dlf8iG',
});

module.exports={
    //create payment instance
    payment: (orderID, amount) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: amount * 100,
                currency: "INR",
                receipt: orderID
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    reject(err);
                } else {
                    resolve(order);
                }
            });
        });
    },
}