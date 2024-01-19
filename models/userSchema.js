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
        minLength:[3,'password should greater than 3 character'],
        maxLength:[8,'password must be less than 8 character']
    },
    address:{
        type:String,
        required:true

    },
    phone:{
      type:Number,
      required:true
    },
    role:{
        type:String,
        default:'user'
    },
    city:{
      type:String,
      required:true
    },
    status: {
      type: String,
    }
   
})

////save passsword
// userSchema.pre("save", async function () {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   });
  //checking the valid password
//   userSchema.methods.isCorrectPassword = async function (password) {
//     return bcrypt.compare(password, this.password);
//     };

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
