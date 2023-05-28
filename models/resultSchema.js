const mongoose=require("mongoose")
const { Schema } = mongoose;


/** result model */
const resultModel = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
   },
     
    code:{
        type: String,
        required: true,
        default: "test"
        
    },
    score:{
      type:String,
      required:true,
    },
    createdAt : { type : Date, default : Date.now}
})
module.exports= mongoose.model('result', resultModel);