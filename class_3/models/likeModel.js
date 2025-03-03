// import mongoose
const mongoose = require("mongoose");

// route handler
const likeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId, // id of post
        ref: "Post", // refrence to the post model
    },
    user: {
        type: String,
        required: true,
    },
    
});



// export
module.exports = mongoose.model("Like", likeSchema);