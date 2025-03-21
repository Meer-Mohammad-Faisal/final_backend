


const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

const blog = require("./routes/blog")
// mount
app.use("/api/v1", blog);

// database
const connectWithDb = require("./config/database")
connectWithDb();

// start the server 
app.listen(PORT, () => {
    console.log(`App is started at port on ${PORT}`);

})

// default route
app.get("/", (req,res) => {
    res.send(`<h1> this is new home page baby </h1>`)
})