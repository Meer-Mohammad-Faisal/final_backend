const SubSection = require("../models/SubSection");
const { updateMany } = require("../models/Course");
const Section = require("../models/Section");


// create subsection ka handler function

exports.createSubSection = async (req, res) => {
    try{

        // fetch data from request body
        const {sectionId, title, timeDuration, description} = req.body;


        //extract file/video 
        const video = req.files.videoFile; 

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create a subsection 
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // update section with subsection objectID
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {
            $push: {subSection: subSectionDetails._id}
        },
        {new: true}

        );


        //HW: log updated section here, after adding populate query

        // return response
        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            updatedSection,
        });
    }

    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//HW: create a function to update subsection
//HW: create a function to delete subsection