const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        immutable: false,
        maxLength: 40,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Incorrect Email ID: " + val);
            }
        }
    },
    password: {
        type: String,
        required: true,
        // match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).{8,}$/,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Password not strong enoug: " + val);
            }
        }
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
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU__UzGcTo0GOAf11f211PZ2wGfMsX--5kBg&s",
        validate(val){
            if(!validator.isURL(val)){
                throw new Error("Not a valid photo URL");
            }
        }
    },
    about: {
        type: String,
        maxLength: 500,
        default: "Brief description about the user"
    },
    skills: {
        type: [String],
        maxLength: 10
    }
},
{
    timestamps: true
});

userSchema.methods.getJwt = async function(){
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "TechBuddies@123", { 
        expiresIn: "7d" 
    });
    
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this
    const passHash = user.password;

    const isValidPassword = await bcrypt.compare(passwordInputByUser, passHash);

    return isValidPassword;
}

const User = mongoose.model("User", userSchema);

module.exports = User;