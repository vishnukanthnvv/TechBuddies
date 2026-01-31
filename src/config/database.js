const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://vishnu_db_user:asdf!234@techbuddies.qf1lt4z.mongodb.net/TechBuddies");
}

module.exports = {
    connectDB
}