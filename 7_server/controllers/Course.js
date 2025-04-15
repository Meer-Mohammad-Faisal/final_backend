const Course = require('../models/Course');
const Tag = require('../models/tags');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');  

// createCourse handler function
exports.createCourse = async (req, res) => {
    try {

        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }
        // check for instructor
        const userId = req.user._id;
        const instructorDetails = await User.findById(userId);
        console.log( "Instructor details",  instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        // check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "Tag Details not found",
            });
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course
        const newCourse = await  Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })


        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {$push: {courses: newCourse._id}},
            {new: true}
        );

        // update the TAG ka schema
        // TODO: hw

        // return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });



    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}






// getAllCourses handler function

exports.showAllCourses = async (req, res) => {
    try{

        // fetch all courses from the database
        // TODO: change the below statment incrementally,
        const allcourses = await Course.find({});

      

        // return response
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: allcourses,
        });



    }

    catch(error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses data",
            error: error.message,
        });
    }
}