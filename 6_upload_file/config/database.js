
const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("DB Connection successfully"))
    .catch( (error) => {
        console.log("DB connection Issues");
        console.error(error);
        process.exit(1);
    })
}