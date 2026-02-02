const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignup = (req) => {
    const { 
        firstName,
        lastName,
        emailId,
        password,
    } = req.body;

    if(firstName.length < 4 || firstName.length > 50){
        throw new Error("First name value should be between 4-50 characters");
    } 
    else if(lastName.length < 4 || lastName.length > 20){
        throw new Error("Last name value should be between 4-20 characters");
    } 
    else if(!validator.isEmail(emailId)){
        throw new Error("Not a valid email ID: " + emailId);
    } 
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password not strong enough");
    }
}

const validateUpdate = (data) => {
    const updatesAllowed = ["firstName", "lastName", "age", "photoUrl", "skills", "password", "gender", "about"];
    const isUpdateAllowed = Object.keys(data).every(k => {
        return updatesAllowed.includes(k);
    });

    if(!isUpdateAllowed){
        throw new Error("Update not allowed for provided properties")
    } else return;
}

const validateSkills = (skills) => {
        if(skills?.length > 10){
            throw new Error("Provided skills exceeds the max limit of 10");
        } else return; 
}

module.exports = {
    validateSignup,
    validateSkills,
    validateUpdate
}