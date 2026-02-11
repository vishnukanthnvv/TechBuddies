const express = require("express");
const userRouter = express.Router();

const { authUser } = require("../middlewares/auth"); 
const connectionRequestModel = require("../models/request");
const userModel = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about";

userRouter.get("/user/requests/received", authUser, async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        const connectionRequests = await connectionRequestModel.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
    
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        const connectionRequests = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUserId, status: "accepted" },
                { toUserId: loggedInUserId, status: "accepted" }
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map(conn => {
            if(conn.fromUserId._id.toString() === loggedInUserId.toString()){
                return conn.toUserId;
            }
            return conn.fromUserId;
        });

        res.json({data});
    }
    catch(err){
        res.status(400)
        .send("Error: "+err.message);
    }
})

userRouter.get("/feed", authUser, async (req, res) => {
    /* 
        user should see all profiles on the feed except below:
            1. His own profile
            2. existing connections
            3. rejected profiles
            4. profile to which connection request is already sent 
    */

    try {
        const loggedInUserId = req.user._id;

        const existingRequests = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select("fromUserId toUserId")

        const hideProfiles = new Set();

        existingRequests.forEach((req) => {
            hideProfiles.add(req.fromUserId.toString());
            hideProfiles.add(req.toUserId.toString());
        });

        const usersFeed = await userModel.find({
            $and:
            [
                { _id: { $nin: Array.from(hideProfiles) }},
                { _id: { $ne: loggedInUserId } }
            ]
        }).select(USER_SAFE_DATA);

        res.json({
            data: usersFeed
        })
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
})

module.exports = userRouter;