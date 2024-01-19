const user = require('../models/userSchema')
const product = require('../helpers/producthelper')
const isAuth = require('../middleware/isAuth')
const bcrypt = require('bcrypt')

module.exports = {
  // updatePassword: async (req, res) => {
  //     const user = await User.findById(req.body.id).select('+pasword')
  //     const isMatchedPassword = await User.comparePassword(req.body.oldPassword)
  //     if (!isMatchedPassword) {
  //         res.status(400).send({ message: 'old password incorect' })
  //     }
  //     if (req.body.newPassword !== req.body.confirmPasswod) {
  //         res.status(400).send({ message: 'password doesnot match' })
  //     }
  //     user.password = req.body.newPasssowrd;
  //     await user.save()

  // },
  register: async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const address = req.body.address;
      const city = req.body.city;
      const phone = req.body.phone;
      const hashpassword = await bcrypt.hash(req.body.password, 10)
      await user.create({ name, email, password, address, city, phone });
      req.session.user = req.body;
      req.session.loggedIn = true;
      res.redirect('/users/login');
    } catch (error) {
      console.log(error);
      res.render("users/login", { invalid: "invalid" });
    }

  },
  addproduct: (req, res) => {
    res.render('admin/addproduct')

  },
  alldata: async (req, res) => {
    const data = await product.allproducts()
    // return data
    const isUser = req.session.loggedIn
    res.render('users/allproducts', { data, isUser })
  },


  verify: async function (req, res) {
    try {
      console.log(req.body);
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
      // const userid=req.body._id;

      const confirm = await user.findOne({ email: email });
      console.log(confirm);
      if (!confirm) {
        res.render("users/login", { invalid: "invalid  user id" });
      }
      else {
        // Check if the user is blocked
        if (confirm.status=='block') {
          return res.render("users/login", { invalid: "Admin blocked you. Contact support for assistance." });
        }
        if (req.body.password == confirm.password) {
          req.session.user = confirm;
          req.session.loggedIn = true;
          console.log(req.session);
          console.log('hello');
          console.log(confirm.role);
          if (confirm.role == 'admin') {
            console.log("i am admin");
            res.redirect("/users/dashboard")
          } else {
            res.redirect('/')
          }

        } else {
          res.render("users/login", { invalid: "Invalid password" })
        }
      }
    } catch (error) {
      console.log(error);
      res.redirect("/users/login", { invalid: "invalid" });
    }
  },


  //get login   
  login: async (req, res) => {
    res.render("users/login");
  },

  signup: (req, res) => {
    res.render('users/signup')
  },
  products: (req, res) => {
    res.render('users/products')

  },

  // cart:async(req,res)=>{
  //     res.render('users/cart')


  // },

  //get all users
  getAllUser: async (req, res) => {
    const user = await User.find()
    res.status(200).json({
      success: true,
      user
    })
  }, 

  logout: async (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
   dashboard: (req, res) => {
    res.render('admin/charts')

  }
}


