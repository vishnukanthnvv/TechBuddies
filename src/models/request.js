const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
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
}
);

const connectionRequestModel = new mongoose.model(
    "connectionRequresModel",
    requestSchema
);

module.exports = connectionRequestModel;