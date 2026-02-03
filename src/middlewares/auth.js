const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { request } = require("express");

const authUser = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Invalid token, Please login again");
        }

        const decodedToken = await jwt.verify(token, "TechBuddies@123");
        const { _id } = decodedToken;
        const profile = await User.findOne({_id});

        if(!profile){
            throw new Error("Incorrect token. User not found");
        }

        request.user = profile;
        next();
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

}

module.exports = {
    authUser
}