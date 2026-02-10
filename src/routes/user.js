const express = require("express");
const userRouter = express.Router();

const { authUser } = require("../middlewares/auth"); 
const connectionRequestModel = require("../models/request");

userRouter.get("/user/requests/received", authUser, async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        const connectionRequests = await connectionRequestModel.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills about");
    
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = userRouter;