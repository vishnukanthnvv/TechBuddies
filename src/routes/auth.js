const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const { validateSignup, validateSkills } = require("../utils/validation")

const authRouter = express.Router();


authRouter.post("/signup", async(req, res) => {
    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;

    try{
        // validate user data
        validateSignup(req);
        validateSkills(req.body?.skills);
        
        // encrypt password
        const passHash = await bcrypt.hash(password, 10);
        
        // Create an instance of User model and save to db
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passHash
        });

        await user.save();
        res.send("User created successfully");
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    
    try{
        const {
            emailId,
            password
        } = req.body;

        const isValidEmail = await validator.isEmail(emailId);
        if(!isValidEmail){
            throw new Error("Not a valid emailId");
        }

        const user = await User.findOne({ emailId });

        if(!user){
            throw new Error("email Invalid login credentials");
        }

        const isCorrectPass = await user.validatePassword(password);

        if(!isCorrectPass){
            throw new Error("password Invalid login credentials");
        }

        const token = await user.getJwt();
        
        res.cookie("token", token, { 
            expires: new Date(Date.now() + 7 * (24 * 3600000))
        });
        res.json({
            message: "User login successfull",
            data: user
        });
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res
    .cookie("token", null, {
        expires: new Date(Date.now())
    })
    .send("Logout successfull")
})

module.exports = authRouter;