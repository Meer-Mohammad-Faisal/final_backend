const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    timeDuration:{
        type:String,
    }, 
    videoURL: {
        type: String,
       
    },
   
});


module.exports = mongoose.model('subSection', subSectionSchema);