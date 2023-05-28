const mongoose=require("mongoose")
const Schema=mongoose.Schema


const QuizSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true,
        
    },option2: {
        type: String,
        required: true,
        
    },option3: {
        type: String,
        required:true
        
    },option4: {
        type: String,
        required:true
        
    },
    answer: {
        type: String,
        required: true,
        
    },
    title: {
        type: String,
        required: true,
    },
    
    code:{
        type: String,
        required: true,
        default: "test"
        
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Quiz", QuizSchema); 
