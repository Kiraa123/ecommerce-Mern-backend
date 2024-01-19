// Set up multer
var path=require('path')
const multer=require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/') // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname) // Rename the uploaded file
    }
  });
  
  const upload = multer({ storage: storage });
  
  
  module.exports=upload;
