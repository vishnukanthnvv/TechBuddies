const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");
const User = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(() => {
        console.log("Connected succesfully to database");
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server listening on port 3000");
        });
    })

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