const express = require("express");
const router = express.Router();
const Textbook = require('../models/Textbook');
const fetchuser=require("../middleware/fetchuser")

router.post('/bookName',fetchuser, async (req, res) => {
    const newBook = new Textbook({name:req.body.name,user:req.user.id});
    try {
        const savedBook = await newBook.save();
        res.status(200).json(savedBook);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/bookName',fetchuser, async (req, res) => {
    try {
        const books = await Textbook.find({user:req.user.id});
        res.status(200).json(books);
    } catch(err) {
        res.status(500).json(err);
    }
});



module.exports = router;