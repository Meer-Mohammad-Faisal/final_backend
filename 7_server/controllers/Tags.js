const Tag = require("../models/tags");

// create tag ka handler funciton

exports.createTag = async (req, res) => {
    try{
        // get data from req body
        const {name, description, } = req.body;

        // validate data
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            })
        }

        // create entry in db
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });
        console.log(tagDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
            tagDetails,
        })



    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




// get all tags ka handler function
exports.getAllTags = async (req, res) => {
    try{
        // get data from db
        const alltags = await Tag.find({}, {name: true, description: true});

        // return response
        return res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            alltags,
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}