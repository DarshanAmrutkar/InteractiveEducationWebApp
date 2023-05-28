const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true,
      
    },
    date: {
        type: Date,
        default: Date.now
    },
    avatarUrl: {
     type:String,
     required:true,
    },
    avatarId:{
      type:String,
      required:true,
    },
    authMethod:{
        type:String,
        default:"jwt"
    },
    googleId:{
        type:String,
        
    }
    
   
});
module.exports = mongoose.model('User', UserSchema);

