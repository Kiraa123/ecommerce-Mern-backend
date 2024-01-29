const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        reqired:true
    },
    password:{
        type:String,
        required:true,
        
    },
    // address:{
    //     type:String,
    //     required:true

    // },
    // phone:{
    //   type:Number,
    //   required:true
    // },
    role:{
        type:String,
        default:'user'
    },
    // city:{
    //   type:String,
    //   required:true
    // },
    status: {
      type: String,
    }
   
})



const deletedUserSchema = mongoose.Schema({
    name: String,
  
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "deleted"
  
    }
  });
  const User=mongoose.model('users',userSchema);
//   const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema)
  module.exports=User;
