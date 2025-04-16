const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');



// capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
    // get courseId and userId
    const {course_id} = req.body;
    const userId = req.user._id;

    // validation
    /// validation courseId
    if(!course_id) {
        return res.status(400).json({
            success: false,
            message: "Please provide courseId",
        });
    };
    // valid courseDetails
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course) {
            return res.status(400).json({
                success: false,
                message: "could not find the course",
            });
        };


        // user already pay for the same course
        const uid = new moongose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "User already enrolled in the course",
            });
        }
    }

    catch(error){
        console.error("Error finding course: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }


    // order create
    const amount = course.price;
    const currency = "INR"; 

    const options = {
        amount: amount * 100, // amount in paise
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        },
    };

    try {
        // initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment response: ", paymentResponse);
        // return the response to the client
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
           
        });
    }

    catch(error){
        console.error("Error creating payment: ", error);
        return res.status(500).json({
            success: false,
            message: "could not initiate the payment",
            
        });
    }
};




// verify the signature of razorpay and server

exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];


    const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");


    if(signature === digest) {
        console.log("Payment is Authenticated successfully");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
            // fulfil the action

            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new: true},
            );

            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "could not find the course",
                });
            }

            console.log("Enrolled course: ", enrolledCourse);
            // find the user and update the enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {courses: courseId}},
                {new: true},
            );
            console.log("Enrolled student: ", enrolledStudent);

            // mail send krdo confirmation ke liye
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congrantulations! from study notion",
                "congratulation, you are enrolled in the course",
            );
            console.log("Email response: ", emailResponse);
            return res.status(200).json({
                success: true,
                message: "Signature verified and course added successfully",
            });

        }

        catch(error){
            console.error("Error finding user: ", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }



    else {
        console.log("Payment is not authenticated successfully");
        return res.status(400).json({
            success: false,
            message: "Signature verification failed",
        });
    }
}