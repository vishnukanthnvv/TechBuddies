const express = require("express");
const { authUser } = require("../middlewares/auth");

const requestRouter = express.Router();
const connectionRequest = require("../models/request");

requestRouter.post("/request/send/:status/:userId", authUser, async (req, res) => {
    try {
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        // is request sending correct status type
        const validStatus = ["interested", "ignored"];
        const isAllowedStatus = validStatus.includes(status);
        if(!isAllowedStatus){
            return res.status(400).json({message: `invalid status type: ${status}`});
        }
        
        // check if toUser exists
        const toUser = connectionRequest.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "User not found to send connection request"});
        }
        
        // can't send connection request to self
        if(fromUserId == toUserId){
            res.status(400).json({message: "Can't send a connection request to yourself"});
        }
        
        //If there is an existing connection request between these userId's
        const isDuplicateRequest = await connectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(isDuplicateRequest){
            return res.status(400).json({message: `Connection request already exists`});
        }


        const request = new connectionRequest({
            fromUserId, toUserId, status
        });

        const data = await request.save();
        res.json({
            message: `${user.firstName} has set the profile ${toUserId} as ${status}`,
            data
        });
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

module.exports = requestRouter;