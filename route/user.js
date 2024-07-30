// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {name,email,password,confirmPassword}=req.body;

        if(!name||!email||!password||!confirmPassword){
            return res.status(400).json({message: "All fields are mandatory"});
        }

        if(password!=confirmPassword){
            return res.status(400).json({message: "Password does not match with confirm password"});

        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            res.status(400).json({message:"User already exists"});
        }

        const encryptedPassword= await bcrypt.hash(password,10);
        await User.create({name,email,password:encryptedPassword})

        res.status(200).json({
            status:"SUCCESS",
            message:"You are registered sucessfully. Please login to proceed",
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({message:"Something went wrong"});
        
    }
});

// router.post('/login', async (req, res) => {
//     try {
//         const {email,password}=req.body;
//         if(!email||!password){
//             res.status(400).json({message:"Both fields are required"});
//         }

//         const user = await User.findOne({ email });
//         if(user){
//             const passwordMatch= await bcrypt.compare(password,user.password);
//             if (passwordMatch) {
//              const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: "2d"})
//             res.status(200)
//             .json({
//                 status: "SUCCESS",
//                 name: user.name,
//                 id:user._id,
//                 message: "You are Logged In Successfully",
//                 jwtToken
//             })
//         }
//         else
//         res.status(400).json({message:"Invalid Credentials"});

//         }
//         else
//         res.status(400).json({message:"Invalid Credentials"});

        
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({message:"Invalid Credentials"})
        
//     }
// });
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Both fields are required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign({ _id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "2d" });
                
                user.tokens = user.tokens.concat({ token: jwtToken });
                await user.save();

                return res.status(200).json({
                    status: "SUCCESS",
                    name: user.name,
                    id: user._id,
                    message: "You are Logged In Successfully",
                    jwtToken
                });
            } else {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Invalid Credentials" });
    }
});

module.exports = router;
