const mongoose = require('mongoose');
require('dotenv').config(); 

exports.connect = () => {
    mongoose.connnect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
    console.log("db connection failed");
    console.error(error);
    process.exit(1);
})
};