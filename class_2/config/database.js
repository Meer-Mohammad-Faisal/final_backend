const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then( () => console.log("DB connect successfully"))
    .catch( (error) => {
    console.log("issue in DB connection");
    console.error(error.message);
    process.exit(1);
    });
}

module.exports = dbConnect;