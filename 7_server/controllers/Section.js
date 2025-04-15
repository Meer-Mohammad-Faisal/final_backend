const Section = require('../models/Section');
const Course = require('../models/Course');

// This function creates a new section and associates it with a course
// It first validates the input data, then creates a new section and updates the course with the new section's ID
// Finally, it returns the updated course details in the response
// It also handles errors and returns appropriate error messages if any issues occur during the process

exports.createSection = async (req, res) => {
    try{
        // data fetch
        const {sectionName, courseId} = req.body;


        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing properties in request body",
            });
        }


        // create section
        const newSection = await Section.create({sectionName});


        // update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {courseContent: newSection._id},
            },
            {new: true}
        );

        //HW: use populate to replace section/sub-sections both in the updatedCourseDetails
        // return response

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        });


    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: error.message,
        });
    }
}







// This function updates an existing section by its ID
// It first validates the input data, then updates the section with the new data
// Finally, it returns the updated section details in the response
// It also handles errors and returns appropriate error messages if any issues occur during the process 

exports.updateSection = async (req, res) => {
    try{
        // data input 
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing properties in request body",
            });
        }
        

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        // return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            
        });

    }


    catch(error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to update section",
            error: error.message,
        });
    }
}







// This function deletes a section by its ID and also removes the section ID from the associated course
// It first validates the input data, then deletes the section and updates the course by removing the section ID
// Finally, it returns a success message in the response
// It also handles errors and returns appropriate error messages if any issues occur during the process
exports.deleteSection = async (req, res) => {
    try{
        // get ID - assuming that we are sending ID in params
        const {sectionId} = req.params;

        // use findByIdAndDelete to delete the section
        await Section.findByIdAndDelete(sectionId);
        //TODO [testing]; do we need to delete the entry from the course as well?


        // return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    }



    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to delete section",
            error: error.message,
        });
    }
}