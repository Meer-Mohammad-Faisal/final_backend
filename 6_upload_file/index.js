// app create 
const express = require("express");
const app = express();

// port find krne hai
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middleware add krna hai
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload());


// db se connect krni hai
const db = require("./config/database");
db.connect();

// cloud se connect krni hai
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// api route mount krni hai
const Upload = require("./routes/FileUpload");
app.use('/api/v1/upload', Upload);

// activation server
app.listen(PORT, () => {
    console.log(`app is running at ${PORT}`);
})