const express = require("express");
const { authUser } = require("../middlewares/auth");

const requestRouter = express.Router();
const User = require("../models/user");
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
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "User not found to send connection request"});
        }
        
        //instead of below validation, we are implementing schema level validation using "pre" in mongoose to check if to and from are same
        /* // can't send connection request to self
        if(fromUserId == toUserId){
            res.status(400).json({message: "Can't send a connection request to yourself"});
        } */

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
            message: `${user.firstName} has set the profile of ${toUser.firstName} with ID: ${toUserId} as ${status}`,
            data
        });
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", authUser, async (req,res) => {
    try {
        const requestId = req.params.requestId;
        const status = req.params.status;
        const { _id } = req.user;

        // check if requested status change is valid
        const allowedStatus = ["accepted", "rejected"];
        const isAllowedStatus = allowedStatus.includes(status);
        if(!isAllowedStatus){
            return res.status(400).json({
                message: `Not a valid status: ${status}`
            });
        }

        //check if request exists and if it was to the current logged in user with correct status
        const request = await connectionRequest.findById({
            _id: requestId,
            toUserId: _id,
            status: "interested"
        })
        if(!request){
            return res.status(404).json({
                message: `Request not found, please send correct requestId.`
            })
        }

        request.status = status;
        const data = await request.save();
        res.json({
            message: `Connection request ${status} successfully`,
            data
        });
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
})

module.exports = requestRouter;