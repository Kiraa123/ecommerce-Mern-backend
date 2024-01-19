const mongoose=require('mongoose')

const databaseUrl=process.env.MONGOOSE_URL
const connect=mongoose.connect(databaseUrl)

connect.then(()=>{
    console.log('db connected');
})
module.exports=connect


