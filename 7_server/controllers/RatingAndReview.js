const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// createRating
exports.creatingRating = async (req, res) => {
    try{
        // get user id
        const userId = req.user.id;
        // fetchdta from request body
        const {rating, review, courseId} = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findById(
            {_id: courseId,
            studentsEnrolled: {$elemMatch: {$eq: userId}}}
        );


        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "student is not enrolled in the course",
            });
        }
        // check if user already reviewed the course 
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });


        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: 'Course is already reviqewed',
            })
        }


        // create new rating and review
        const ratingReview = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review,
        });


        // update course with rating and reviews
        await Course.findByIdAndUpdate({_id:courseId}, {
            $push: {
                ratingAndReviews: ratingReview._id,
            },
        },
        {new:true}
        );
        

        console.log(updatedCourseDetails);




        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            ratingReview,
        })
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create rating and review",
            error: error.message,
        });
    }
}


// getAverageRating
exports.getAverageRating = async (req, res) => {
    try{
        // get course id from request body
        const {courseId} = req.body.courseId;
        // get average rating and review
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                },
            },
        ]);

        // return rating
    
        if(result.length > 0) {

            return res.status(200).json({
                success:true,
                message:"Average rating fetched successfully",
                averageRating: result[0].averageRating,
            });
        }


        // if no rating found
        return res.status(200).json({
            success:true,
            message:"Average rating is 0 ,  No rating found",
            averageRating: 0,
        });

        // return response
      
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch average rating",
            error: error.message,
        });
    }
}


//getAllRating
exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path:"user",
                                    select: "firstName lastName email image",
                                })    
                                .populate({
                                    path:"course",
                                    select: "courseName",
                                })    
                                .exec(); 
            
        // return response
        return res.status(200).json({
            success:true,
            message:"All rating and reviews fetched successfully",
            data:allReviews,
        }); 


    } 
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all rating and reviews",
            error: error.message,
        });
    }
}