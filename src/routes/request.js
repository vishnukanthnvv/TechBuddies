const express = require("express");
const { authUser } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", authUser, async (req, res) => {
    try {
        const user = req.user;

        if(!user){
            throw new Error("user info missing to send request");
        }

        res.send(user.firstName + " sent connection request");
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

module.exports = requestRouter;