const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is invalid status type`
        }
    }
},
{
    timestamps: true
});

connectionRequestSchema.pre("save", function(next){
    const request = this;
    if(request.fromUserId.equals(request.toUserId)){
        throw new Error("Can't send a connection request to yourself");
    }
    next();
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

const connectionRequestModel = new mongoose.model(
    "connectionRequestModel",
    connectionRequestSchema
);

module.exports = connectionRequestModel;