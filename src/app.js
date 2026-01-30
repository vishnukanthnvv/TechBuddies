const express = require("express");

const app = express();


app.use("/test", (req, res) => {
    res.send("Welcome to test API");
});

app.use("/hello", (req, res) => {
    res.send("Hello from Vishnu");
})

app.use("/", (req, res) => {
    res.send("Welcome to Dashboard");
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});