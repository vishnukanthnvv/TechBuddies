const express = require("express");
const userRouter = express.Router();

const { authUser } = require("../middlewares/auth"); 
const connectionRequestModel = require("../models/request");
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

module.exports = userRouter;