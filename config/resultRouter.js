const express = require("express");
const router = express.Router();
const Result = require('../models/resultSchema');
const fetchuser=require("../middleware/fetchuser")

router.post('/result/:message',fetchuser, async (req, res) => {
    const newResult = new Result({name:req.body.name,user:req.user.id,email:req.body.email,score:req.body.val,code:req.params.message});
    try {
        const savedResult = await newResult.save();
        res.status(200).json(savedResult);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/result/:message',fetchuser, async (req, res) => {
    try {
        const result = await Result.find({code:req.params.message}).populate("user","name");
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports=router;