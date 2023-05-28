const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://amrutkardarshan:AfQwGgIeiBd6vu2P@mydatabase.app5ypv.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("mongodb connection")
})
.catch(()=>{
    console.log("failed")
})

const newSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection=mongoose.model("collection",newSchema);
module.exports=collection;