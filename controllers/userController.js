const user = require('../models/userSchema')
const product = require('../helpers/producthelper')
const bcrypt = require('bcrypt')
const User = require('../helpers/userhelper')
const otp = require('../config/otp')
const { success } = require('./orderController')
const cart = require('../models/cartSchema')
const Banner = require('../models/banner')

module.exports = {

  register: async (req, res) => {
    try {
      const generatedotp = await otp.generateOTP();
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const verification = generatedotp;

      const hashpassword = await bcrypt.hash(password, 10);

      const userObject = {
        name: name,
        email: email,
        password: hashpassword,
        verification: generatedotp
      };

      // Send OTP email
      await otp.sendOTPEmail(userObject.email, generatedotp);

      // Save the userObject in the session to use it later for OTP verification
      req.session.tempUser = userObject;

      res.render('users/otp');
    } catch (error) {
      res.render("users/login", { invalid: "invalid" });
    }
  },


  validateotp: async (req, res) => {
    try {

      const enteredOTP = req.body.enteredOTP;
      const savedUser = req.session.tempUser;


      // Validate the entered OTP against the generated OTP
      if (enteredOTP == savedUser.verification) {
        // OTP is correct, proceed to create the user in the database
        const result = await User.createUser(savedUser);
        // const userid = result[0]._id;

        // Remove tempUser from the session
        delete req.session.tempUser;

        // Set session variables for the logged-in user


        req.session.user = savedUser;
        req.session.loggedIn = true;




        res.json({ success: true })
        // await User.gmail(result.email, result.name) //welcome mail
        res.render('users/login')
      } else {
        // Incorrect OTP
        res.json({ success: false });
        res.render('users/otp', { error: 'Incorrect OTP. Please try again' });
      }
    } catch (error) {
      res.render("users/login", { invalid: "invalid" });
    }
  },


  edituser: async (req, res) => {
    const existuser = req.session.user
    const data = await User.findexistuser(existuser.name)
    res.render('users/profile', { data: data, name: existuser.name })
  },
  forgotpassword: async (req, res) => {
    res.render('users/forgotpassword')
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
    const userId = req.session.user;
    let count = 0;

    count = await User.count(userId);


    const isUser = req.session.loggedIn;

    if (isUser) {
      count = await User.count(userId);
    } else {
      const guestCart = req.session.guest || 0;
      console.log(guestCart, 'guest')
      count = guestCart.length;
      console.log('count', count)
      // res.render('users/allproducts', { data, isUser, count })
    }
    res.render('users/allproducts', { data, isUser, count })

  },
    alldata1: async (req, res) => {
      const data = await product.allproducts2()
      // return data
      const isUser = req.session.loggedIn
      res.render('users/allproducts', { data, isUser })
    },

      limitdata: async (req, res) => {
        const userId = req.session.user;
        const data = await product.allproducts1();
        const banner = await Banner.find({}).lean();

        let count = 0;
        const isUser = req.session.loggedIn;

        if (isUser) {
          count = await User.count(userId);
        } else {
          const guestCart = req.session.guest || 0;
          console.log(guestCart, 'guest')
          count = guestCart.length;
          console.log('count', count)
        }


        res.render('index', { data, isUser, banner, count });

      },


        home: async (req, res) => {

          const isUser = req.session.loggedIn
          const data = module.exports.limitdata()
          res.render('index', { isUser, data });

        },
          changepassword: async (req, res) => {
            isUser = req.session.user
            res.render('users/changepassword', { isUser })
          },
            password: async (req, res) => {
              isUser = req.session.user

              const username = req.session.user.name


              if (req.body.password == req.body.confirmpassword) {

                const pswd = await bcrypt.hash(req.body.password, 10);


                await User.updatepassword(username, pswd)
                res.render('users/changepassword', { message: "Password updated successfully", isUser })
              } else {
                res.render('users/changepassword', { message: "Password is Not Match", isUser })
              }
            },

              orders: async (req, res) => {
                const isUser = req.session.loggedIn
                const username = req.session.user.email
                const orders = await User.ordersfind(username);
                res.render('users/orders', { data: orders, isUser })
              },


                verify: async function (req, res) {
                  try {
                    const guestCart = req.session.guest || [];
                    const email = req.body.email;
                    const password = req.body.password;
                    const confirm = await user.findOne({ email: email });

                    if (!confirm) {
                      res.render("users/login", { invalid: "Invalid user id" });
                    } else {
                      // Check if the user is blocked
                      if (confirm.status == 'block') {
                        return res.render("users/login", { invalid: "Admin blocked you. Contact support for assistance." });
                      }

                      const hashedPassword = confirm.password;
                      const passwordMatch = await bcrypt.compare(password, hashedPassword);

                      if (passwordMatch) {
                        // Set user session before merging carts
                        req.session.user = confirm;
                        req.session.loggedIn = true;

                        // Merge guest cart into user cart if a guest cart exists
                        if (guestCart.length > 0) {
                          const userId = confirm._id;

                          // const userCart = await User.getitemscart(userId);

                          // Merge logic (you may need to adjust this based on your data structure)
                          const mergedCart = mergeCarts(userId, guestCart);

                          // Update user's cart with the merged cart
                          await User.updateCartItems(userId, mergedCart);
                        }

                        // Redirect based on user role
                        if (confirm.role == 'admin') {
                          res.redirect("/admin/orderSummary");
                        } else {
                          // Redirect to the cart page or homepage based on your flow
                          res.redirect('/');  // Update with your cart route
                        }
                      } else {
                        res.render("users/login", { invalid: "Invalid password" });
                      }
                    }
                  } catch (error) {
                    res.render("users/login", { invalid: "User not exists" });
                  }

                  async function mergeCarts(userid, data) {
                    try {
                      const userCart = await cart.findOne({ user: userid });

                      if (!userCart) {
                        // If the user doesn't have a cart, create a new one
                        const newCart = new cart({ user: userid, items: [], totalPrice: 0 });
                        await newCart.save();
                        return newCart;
                      }

                      for (const item of data) {
                        const price = await product.finddata(item.product);
                        const totprice = item.quantity * price.price;

                        // Check if the product already exists in the cart
                        const existingItem = userCart.items.find(cartItem => cartItem.product.toString() === item.product.toString());

                        if (existingItem) {
                          // If the product exists, update the quantity and total price
                          existingItem.quantity += item.quantity;
                          existingItem.totalPrice += totprice;
                        } else {
                          // If the product doesn't exist, add it to the items array
                          userCart.items.push({
                            product: item.product,
                            quantity: item.quantity,
                            totalPrice: totprice
                          });
                        }

                        // Increment the total price
                        userCart.totalPrice += totprice;
                      }

                      // Save the updated cart
                      await userCart.save();

                      return userCart;
                    } catch (error) {
                      throw error; // Propagate the error up for handling in the calling function
                    }
                  }


                },




    //get login   
    login: async (req, res) => {
      res.render("users/login");
    },

      signup: (req, res) => {
        res.render('users/signup')
      },
        products: async (req, res) => {
          const userId = req.session.user;
          let count = 0
          count = await User.count(userId);
          console.log(count, 'count')

          res.render('users/products', { count })

        },


          getAllUser: async (req, res) => {
            const user = await User.find()
            res.status(200).json({
              success: true,
              user
            })
          },
            moredetails: async (req, res) => {
              const isUser = req.session.user;
              const productid = req.params.id;
              var data = await product.finddata(productid);
              const otherdata = await product.allproducts(req)
              res.render('users/moredetails', { data, otherdata, isUser })
            },

              logout: async (req, res) => {
                req.session.destroy();
                res.redirect('/');
              },
                wishlist: async (req, res) => {
                  const userid = req.session.user._id;
                  const wishlistitems = await User.getwishlist(userid);
                  let isUser = req.session.user;
                  if (wishlistitems) {
                    res.render("users/wishlist", { wishlist: wishlistitems.items, isUser });
                  } else {
                    res.render('users/wishlist')
                  }

                },
                  addwishlist: async (req, res) => {
                    const proid = req.params.id;
                    const userid = req.session.user._id;
                    const addWishlist = await User.wishlistAdd(userid, proid);
                    res.json(addWishlist)

                  },
                    deletewishlist: async (req, res) => {
                      const proid = req.params.id;
                      const userid = req.session.user._id;
                      const deletedWishlist = await User.wishlistdelete(userid, proid);
                      // res.redirect("/users/wishlist");
                      res.render('users/wishlist', { deletedWishlist })
                    },

}


