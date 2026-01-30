const express = require("express");

const app = express();

const { authAdmin, authUser} = require("./middlewares/auth");

app.use("/admin", authAdmin);

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
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});