const express = require("express");

const app = express();

const { authAdmin, authUser} = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");

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
        if(skills.length > 10){
            throw new Error("Provided skills exceeds the max limit of 10");
        } else return; 
}

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

app.post("/signup", async(req, res) => {
    const user = new User(req.body);

    try{
        validateSkills(user?.skills);
        await user.save();
        res.send("User created successfully");
    } catch(err){
        res.status(400).send("Error ocurred while creating user" + err.message);
    }
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
        res.status(404).send("Encountered an error" + err.message);
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
        res.status(400).send("Encountered error" + err.message);
    }
});

app.delete("/user", async (req, res) => {
    const emailId = req.body.emailId;
    try{
        const user = await User.findOneAndDelete({emailId});
        res.send("User deleted successfully");
    } catch(err){
        res.status(400).send("Error while deleting user" + err.message);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch(err){
        res.status(400).send("Error while deleting user" + err.message);
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
        res.status(400).send("Error ocurred while updating user: " + err.message);
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
        res.status(400).send("Error ocurred while updating user: " +err.message);
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