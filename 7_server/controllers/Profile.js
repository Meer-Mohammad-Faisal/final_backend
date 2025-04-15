const Profile = require('../models/Profile');
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
    try {
        // get data from request body
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;

        // get userId from req.user
        const id = req.user._id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile details
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;   
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });
    }

    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



//delete profile ka handler function
// Explore-> how can be schedule this function to run at a specific time
exports.deleteProfile = async (req, res) => {
    try{
        // get id from req.user
        const id = req.user._id;



        // validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});

        //TODO: unenroll user from all enroll courses

        // delete user
        await User.findByIdAndDelete({_id: id});


        
        // return response
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });


    }


    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




//  // get profile ka handler function


exports.getAllUserProfile = async (req, res) => {
    try{
        // get id
        const id = req.user._id;


        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response
        return res.status(200).json({
            success: true,
            message: "user Data fetched successfully",
            
        });

    }


    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}