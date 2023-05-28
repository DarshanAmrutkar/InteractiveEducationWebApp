const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const cloudinary=require("cloudinary");

 const JWT_SECRET = "helloiamsecret"


router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    
  ],
  async (req, res) => {
    var success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
  

    try {
      const fileStr = req.body.avatar;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: 'avatars',
      });
      console.log(uploadResponse);
      
    
      
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this email already exists" });
      }
    
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)
      
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        avatarUrl: uploadResponse.secure_url,
        avatarId:uploadResponse.public_id,
         
         
      });

     
     
      const data = {
        user: {
          id: user.id
        }
      }
      const JWT_SECRET = "helloiamsecret"
      const authToken = jwt.sign(data, JWT_SECRET);

      
      success = true;
      await user.save();
     
      res.json({success,authToken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured")
    }
  }
);


router.post(
  "/login",
  [
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    var success = false;
     // If there are errors, return bad req and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { email, password } = req.body;
     try {
  
      let user = await User.findOne({email});
    
      if(!user){
    

        return res.status(400).json({error: "Please try to login with correct credentials"});
      }

   
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success: false;
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }

     
      const data = {
        user: {
          id: user.id
        }
      }
      const JWT_SECRET = "helloiamsecret";
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});

     } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
     }
  });

  router.post( "/getuser", fetchuser, async (req, res) => {

      try {
        
        const user = await User.findById(req.user.id).select("-password")
       
        res.json(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
      }
    });      

   router.put("/updateprofile",fetchuser,async (req, res) => {
    
  
    
      
    try{
      const newData={
        name:req.body.name,
        email:req.body.email,
      }

      if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatarId;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const fileStr = req.body.avatar;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'avatars',
        });
    
      newData.avatarUrl=uploadResponse.secure_url;
      newData.avatarId=uploadResponse.public_id;
      }
      
        
        
      const user = await User.findByIdAndUpdate(req.user.id,newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
     
     
      
   
    
      res.status(200).json({
        success: true,
      });
    }
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
    }
    });


  
module.exports = router;