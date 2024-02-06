
const { User, DeletedUser } = require('../models/userSchema')
const user=require('../helpers/userhelper')
const product=require('../helpers/producthelper')
const fs=require('fs')

module.exports = {

    admin: async (req, res) => {
        const user = new User({
            // name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
        })
        const newUser = await user.save();
        if (newUser) {
            res.send({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,

            })
        } else {
            res.status(401).send({ message: 'Invalid user data' })
        }
    },
    cadmin: async function (req, res) {
        try {
            const user = new User({
                name: 'abcd',
                email: 'abcd@123',
                role: "admin",
                pasword:'abcd'
                // password: await bcrypt.hash("abcdef", 10)

            })
            if(user){
                res.redirect('/users/cart')
            }
            const newUser = await user.save();
            res.send(newUser)

        } catch {
            return res.status(500).send({ err: "Internal server error" });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHander("Please Enter Email & Password", 400));
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({ err: "Email not found!" });
        }

    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },
    edituser: async (req, res) => {
        const productid = req.params.id
        const data = await user.findedituserbyid(productid)
        console.log(data);
        
        res.render('admin/edituser', { data:data})
      },
    edituserpost: async (req, res) => {
        const productid = req.params.id
        const datas = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          address: req.body.address,
          city:req.body.city
        }
        console.log(datas);
        await user.edituser(datas, productid);
        res.redirect('/admin/alluser')
      },
      blockuser: async (req, res) => {
        const productid = req.params.id
        await user.blockuser(productid)
        res.redirect('/admin/alluser');
      },
      unblockuser: async (req, res) => {
        const productid = req.params.id
        await user.unblockuser(productid)
        res.redirect('/admin/alluser');
      },
    deleteuser: async (req, res) => {
        let productid = req.params.id;
        const result = await user.finduserid(productid)
        const datas = {
          role: result.role,
          name: result.name,
          email: result.email,
          password: result.password,
          phone: result.phone,
          gender: result.gender,
          address: result.address,
          city:result.city
        }
        await user.insertdelete(datas)
        await user.delete(productid)
        res.redirect('/admin/alluser')
      },
    alluser:async(req,res)=>{
        const data=await user.finduser()
        res.render('admin/allusers',{data})
    },
    deleteproduct: async (req, res) => {
      const proid = req.params.id
      const data = await product.finddata(proid);
      const imagePath = './public/uploads/' + data.image;
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting existing image:', unlinkErr);
        }
      });
      await product.deleteproduct(proid)
      res.redirect('/admin/products');
    },
    editproduct: async (req, res) => {
        const productid = req.params.id
        const data = await product.finddata(productid)
        console.log(data);
        res.render('admin/editproduct', {data})
    
      },
      edit_product: async (req, res) => {
        const productid = req.params.id
        const data = await product.finddata(productid);
        var image = data.image
          const imagePath = './public/uploads/' + image;
          fs.unlink(imagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error('Error deleting existing image:', unlinkErr);
            }
          });
        const datas = {
          productname: req.body.productname,
          image: req.file.filename,
          price: req.body.price,
          category: req.body.category,
          quantity: req.body.quantity,
          description:req.body.description,
        }
        await product.editproduct(datas, productid)
        res.redirect('/admin/products')
      },
      searchuser: async (req, res) => {
        const query  = req.query;
        const data = await user.searchuser(query)
        res.render('admin/search', { data: data });
      },
      adminlogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')

      },
      dashboard: (req, res) => {
        res.render('admin/charts')
    
      }
    
}







