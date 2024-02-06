const user = require('../models/userSchema')
const product = require('../helpers/producthelper')
const bcrypt = require('bcrypt')
const User=require('../helpers/userhelper')
const otp=require('../config/otp')

module.exports = {
  
  register: async (req, res) => {
    const generatedotp=await otp.generateOTP()
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const verification=generatedotp

      // const address = req.body.address;
      // const city = req.body.city;
      // const phone = req.body.phone;
      const hashpassword = await bcrypt.hash(password, 10)
      const userObject = {
        name: name,
        email: email,
        password: hashpassword,
        verification:generatedotp
        // address: address,
        // phone: phone,
        // city: city
      };
      
      await otp.sendOTPEmail(userObject.email,generatedotp)
      const result=await User.createUser(userObject );
      const userid=result[0]._id;

      req.session.user = req.body;
      req.session.loggedIn = true;

      res.render('users/otp',{userid:userid})
    } catch (error) {
      console.log(error);
      res.render("users/login", { invalid: "invalid" });
    }

  },
  addproduct: (req, res) => {
    res.render('admin/addproduct')

  },
  edituser: async (req, res) => {
    const existuser = req.session.user
    const data = await User.findexistuser(existuser.name)
    // if (data.gender == 'male') {
    //   flag = true
    // }
    // else {
    //   flag = false
    // }
    res.render('users/profile', { data: data, name: existuser.name })
  },
  forgotpassword: async (req, res) => {
    res.render('users/forgotpassword')
  },
  validateotp: async (req, res) => {

    const result = await User.findedituserbyid(req.body.id)
    if ((req.body.enteredOTP) && (result)) {
      if (result.verification == req.body.enteredOTP) {
        await User.verified(req.body.id)
        res.json({ success: true })
        await User.gmail(result.email, result.name) //welcome mail
        res.render('users/login')
      }
      else {
        await User.delete(req.body._id)
        res.json({ success: false });
      }
    }
    else {
      await User.delete(req.body._id)
      res.status(422).json({ error: "Field can't be empty!" })
    }
  },
  timeexeed: async (req, res) => {
    const proid = req.params.id
    await User.delete(proid)
    res.render('users/signup')
  },
  sendotp: async (req, res) => {
    const result = await User.finduseremail(req.body.email)
    if (result) {
      const generatedotp = await otp.generateOTP()
      await otp.sendOTPEmail(req.body.email, generatedotp);
      res.json(generatedotp)
    }
    else {
      res.json({ error: "error" })
    }
  },
  resetpassword: async (req, res) => {
    const hashpassword = await bcrypt.hash(req.body.newPassword, 10)
    await User.forgotpassword(req.body.email, hashpassword)
    res.json("success")
  },
  edituserpost: async (req, res) => {
    let productid = req.params.id;
    const result = await User.edituser(req.body, productid)
    res.redirect('/')
  },
  alldata: async (req, res) => {
    const data = await product.allproducts1()
    // return data
    const isUser = req.session.loggedIn
    res.render('users/allproducts', { data, isUser })
  },
  alldata1: async (req, res) => {
    const data = await product.allproducts2()
    // return data
    const isUser = req.session.loggedIn
    res.render('users/allproducts', { data, isUser })
  },

  limitdata: async (req, res) => {
    const data = await product.allproducts1()
    // return data
    const isUser = req.session.loggedIn
    res.render('index', { data, isUser })
  },
  home:async(req,res)=>{
    const isUser=req.session.loggedIn
    const data=module.exports.limdata()

  res.render('index',{isUser,data});

  },
  changepassword: async (req, res) => {
    isUser=req.session.user
    res.render('users/changepassword',{isUser})
  },
  password: async (req, res) => {
    const username = req.session.user.name
    

    if (req.body.password == req.body.confirmpassword) {
      
      const pswd=await req.body.password;
      await User.updatepassword(username,pswd)
      res.render('users/changepassword', { message: "Password updated successfully" })
    } else {
      res.render('users/changepassword', { message: "Password is Not Match" })
    }
  },

  orders: async (req, res) => {
    const isUser=req.session.loggedIn
    const username = req.session.user.email
    const orders = await User.ordersfind(username);
    console.log(orders);
    res.render('users/orders', { data: orders ,isUser})
  },


  verify: async function (req, res) {
    try { 
      const email = req.body.email;
      const password = req.body.password
      const confirm = await user.findOne({ email: email });
      const hashedPassword=confirm.password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword)

      console.log(confirm);
      if (!confirm) {
        res.render("users/login", { invalid: "invalid  user id" });
      }
      else {
        // Check if the user is blocked
        if (confirm.status=='block') {
          return res.render("users/login", { invalid: "Admin blocked you. Contact support for assistance." });
        }
        if (passwordMatch) {
          req.session.user = confirm;
          req.session.loggedIn = true;
          if (confirm.role == 'admin') {
            console.log("i am admin");
            res.redirect("/admin/dashboard")
          } else {
            res.redirect('/')
          }

        } else {
          res.render("users/login", { invalid: "Invalid password" })
        }
      }
    } catch (error) {
      console.log(error);
      res.render("users/login", { invalid:"User not exists" });
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

  
  getAllUser: async (req, res) => {
    const user = await User.find()
    res.status(200).json({
      success: true,
      user
    })
  }, 
  moredetails: async (req, res) => {
    const productid = req.params.id;
    var data = await product.finddata(productid);
    const otherdata = await product.allproducts(req)
    res.render('users/moredetails', { data, otherdata })
  },

  logout: async (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
   
}


