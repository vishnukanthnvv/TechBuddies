const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { validateSignup, validateUpdate, validateSkills} = require("./utils/validation");
const { authAdmin, authUser} = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

connectDB()
    .then(() => {
        console.log("Connected succesfully to database");
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server listening on port 3000");
        });
    })
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req, res) => {
    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;

    try{
        // validate user data
        validateSignup(req);
        validateSkills(req.body?.skills);
        
        // encrypt password
        const passHash = await bcrypt.hash(password, 10);
        
        // Create an instance of User model and save to db
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passHash
        });

        await user.save();
        res.send("User created successfully");
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

app.post("/login", async (req, res) => {
    const {
        emailId,
        password
    } = req.body;

    try{
        const isValidEmail = await validator.isEmail(emailId);
        if(!isValidEmail){
            throw new Error("Not a valid emailId");
        }

        const user = await User.findOne({ emailId });

        if(!user){
            throw new Error("email Invalid login credentials");
        }

        const isCorrectPass = await bcrypt.compare(password, user.password);

        if(!isCorrectPass){
            throw new Error("password Invalid login credentials");
        }

        const token = await jwt.sign({_id: user._id}, "TechBuddies@123");
        res.cookie("token", token);
        res.send("User login successfull");
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

app.get("/profile", async (req, res) => {
    
    try{
        const { token } = req.cookies;

        if(!token){
            throw new Error("Invalid token");
        }

        const cookieDecoded = await jwt.verify(token, "TechBuddies@123");
        const { _id } = cookieDecoded;
        const profile = await User.findOne({ _id });

        if(!profile){
            throw new Error("invalid token. please login again");
        }
        
        res.send(profile);
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }     
});


app.get("/user", async (req, res) => {
    try{
        const users = await User.find({ emailId: req.body.emailId });
        if(!users.length){
            res.send("No users found");
        } else {
            console.log(`Found ${users.length} users`);
            res.send(users);
        }
    } catch(err){
        res.status(404).send("Error: " + err.message);
    }
});

app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        if(!users.length){
            res.send("No users founds");
        } else {
            console.log(`FOund ${users.length} users`);
            res.send(users);
        }
    } catch(err){
        res.status(400).send("Encountered error: " + err.message);
    }
});

app.delete("/user", async (req, res) => {
    const emailId = req.body.emailId;
    try{
        const user = await User.findOneAndDelete({emailId});
        res.send("User deleted successfully");
    } catch(err){
        res.status(400).send("Error while deleting user: " + err.message);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch(err){
        res.status(400).send("Error while deleting user: " + err.message);
    }
});

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    try{

        validateUpdate(data);

        validateSkills(data?.skills);

        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true
        });
        console.log(user);
        res.send("User updated successfully");
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

app.patch("/userByEmail/:emailId", async (req, res) => {
    const emailId = req.params.emailId;
    const data = req.body;

    try{
        validateUpdate(data);
        validateSkills(data?.skills);

        const user = await User.findOneAndUpdate({ emailId }, data, { 
            returnDocument: 'after',
            runValidators: true
        });
        console.log(user);
        res.send("Usre updated successfully");
    }catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

/* app.use("/admin", authAdmin);

app.get("/admin/getAllData", (req,res) => {
    res.send("sending all users data");
});

app.delete("/admin/deleteUser", (req, res) => {
    res.send("deleted user data");
});

// .get will match only the get API call with respective matching route
app.post("/user/login", (req, res) => {
    res.send("Login req received");
})

app.use("/user", authUser);

app.get("/user", (req, res) => {
    try{
        const id = req.query.userId;
        const age = req.query.age;
        // throw new Error("some bad req error");
        res.send({
            "userId": id,
            "firstName": "Vishnu Kanth",
            "lastName": "Nalamati",
            "dob": "18/08/1988",
            "city": "Vizag",
            "age": age
        });
    }
    catch(err){
        res.status(500).send("Unexpected error. contact support team");

    }
});

app.post("/user", (req, res) => {
    res.send("User data saved succesfully");
})

app.patch("/user/:userId", (req, res) => {
    // throw new Error("asfavaf");
    res.send(`User ${req.params.userId} details updated successfully`)
});

app.delete("/user/:userId", (req, res) => {
    res.send(`User ${req.params.userId} deleted successfully`);
});

// .use will match all http method calls  matching the route like get, post, put
app.use("/test", (req, res) => {
    res.send("Welcome to test API");
});

app.use("/", (req, res) => {
    res.send("Welcome to Dashboard");
});

app.use("/", (err, req, res, next) => {
    res.status(500).send("Observed fatal error");
}) */