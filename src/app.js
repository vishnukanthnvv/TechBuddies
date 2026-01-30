const express = require("express");

const app = express();

// .get will match only the get API call with respective matching route

app.get("/user", (req, res) => {
    res.send({
        "firstName": "Vishnu Kanth",
        "lastName": "Nalamati",
        "dob": "18/08/1988",
        "city": "Vizag"
    });
});

app.post("/user", (req, res) => {
    res.send("User data saved succesfully");
})

app.patch("/user", (req, res) => {
    res.send("User details updated successfully");
});

app.delete("/user", (req, res) => {
    res.send("User deleted successfully");
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