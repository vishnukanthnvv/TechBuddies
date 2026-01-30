const express = require("express");

const app = express();

// .get will match only the get API call with respective matching route

app.get("/user", (req, res) => {
    const id = req.query.userId;
    const age = req.query.age;
    res.send({
        "userId": id,
        "firstName": "Vishnu Kanth",
        "lastName": "Nalamati",
        "dob": "18/08/1988",
        "city": "Vizag",
        "age": age
    });
});

app.post("/user", (req, res) => {
    res.send("User data saved succesfully");
})

// we can also hangle apI req with multiple unlimited route handlers like below.
// we can pass req handler either using [] or in-line one after the other.
// next() is mandatory to pass the control to next req handler untill res.send() occurs
// once res.send() is done, we can no longer pass to next roter handlers. res.send() should be in the last req handler
app.patch("/user/:userId", (req, res, next) => {
    console.log("In 1st req handler"),
    // res.send(`User ${req.params.userId} details updated successfully`);
    next();
}, 
[(req, res, next) => {
    console.log("in 2nd req handler");
    // res.send(`User ${req.params.userId} details updated successfully from 2nd req handler`);
    next();
},
(req, res, next) => {
    console.log("in 3rd response handler");
    // res.send(`User ${req.params.userId} details updated successfully from 3rd req handler`);
    next();
}],
(req, res) => {
    console.log("In 4th req handler");
    res.send(`User ${req.params.userId} details updated successfully from 4th req handler`)
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

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});