const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextbookSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Textbook", TextbookSchema);