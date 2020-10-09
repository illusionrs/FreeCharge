const mongoose = require('mongoose')


                                                                  
const UserSchema = new mongoose.Schema({

  name:{
      type: String,
      required:true,
  },
  username:{

    type:String,
    unique:true,
    
  },

  password:{

    type:String,
    required:true,
    minlength:5

  },
  accountNumber:{
      type:Number,
      required:true,
      unique:true
  }

})

const Customer=mongoose.model('customer',UserSchema);

module.exports= Customer