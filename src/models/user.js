const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).{8,}$/
    },
    age: {
        type: Number,
        min: 15
    },
    gender: {
        type: String,
        validate(val) {
            if(!["male", "female", "others"].includes(val)){
                throw new Error("Incorrect gender value");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU__UzGcTo0GOAf11f211PZ2wGfMsX--5kBg&s"
    },
    about: {
        type: String,
        default: "Brief description about the user"
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;