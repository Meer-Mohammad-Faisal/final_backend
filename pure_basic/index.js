

const express = require("express");
const app = express();
const port = 3000;

// adding middleware 
app.use(express.json());

// get request 
app.get("/", (req, res) => {
    res.send("<h1> this is my heading </h1>")
})

app.listen(port, () => {
    console.log("App started");
})