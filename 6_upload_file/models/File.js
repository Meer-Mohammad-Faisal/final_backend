const mongoose = require("mongoose");
// import nodemialer
const nodemailer = require("nodemailer");
const fileSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    imageUrl: {
        type:String,
    },
    tags: {
        type:String,
    },
    email: {
        type:String,
    }
})



// post middleware
fileSchema.post("save", async function(doc){
    try{
        console.log("DOC->", doc);



    } catch(error) {
        console.error(error);
        
    }

})


const File = mongoose.model("File", fileSchema);
module.exports = File