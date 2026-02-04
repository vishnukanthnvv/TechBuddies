const express = require("express");
const profileRouter = express.Router();
const { validateUpdate, validateSkills } = require("../utils/validation");
const { authUser } = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/profile/view", authUser, async (req, res) => {
    
    try{
        const profile = req.user;

        if(!profile){
            throw new Error("invalid token. please login again");
        }
        
        res.send(profile);
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }     
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
    const data = req.body;
    try{
        validateUpdate(data);
        validateSkills(data?.skills);

        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(data).forEach((key) => {
            loggedInUser[key] = data[key];
        })

        await loggedInUser.save();

        res.send({ 
            message:`${loggedInUser.firstName}, Your profile has been updated successfully`,
            data: loggedInUser
        });
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.patch("/userByEmail/:emailId", authUser, async (req, res) => {
    const emailId = req.params.emailId;
    const data = req.body;

    try{
        validateUpdate(data);
        validateSkills(data?.skills);

        const user = await User.findOneAndUpdate({ emailId }, data, { 
            returnDocument: 'after',
            runValidators: true
        });
        console.log(user);
        res.send("Usre updated successfully");
    }catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

profileRouter.delete("/user", authUser, async (req, res) => {
    const emailId = req.body.emailId;
    try{
        const user = await User.findOneAndDelete({emailId});
        res.send("User deleted successfully");
    } catch(err){
        res.status(400).send("Error while deleting user: " + err.message);
    }
});

profileRouter.delete("/user", authUser, async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch(err){
        res.status(400).send("Error while deleting user: " + err.message);
    }
});

module.exports = profileRouter;