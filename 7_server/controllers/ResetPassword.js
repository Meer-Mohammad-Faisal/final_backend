const User = require("../models/User");
const mailSender = require("../utils/mailSender");


// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
   try{
     // get email from req body
     const email = req.body.email;


     // check user for this email, email validation
     const user = await User.findOne({email: email});
     if(!user) {
         return res.status(401).json({
             success: false,
             message: "Your email is not registered with us",
         });
     }
 
 
     // genrate token
     const token = crypto.randomUUID();
 
 
     // update user by adding token and expiration time
     const updatedDetails = await User.findByIdAndUpdate(
         {email: email},
         {
             token: token,
             resetPasswordExpires: Date.now() + 5*60*1000, // 5 minutes
         },
         {new: true}
     )
 
     // create url
     const url = `htttp://localhost:3000/update-password/${token}`;
 
 
     // send mail containg the url
     await mailSender(
         email,
         "password reset Ling",
         `password reset link is here: ${url}`
     )
 
 
     // return response
     return res.status(200).json({
         success: true,
         message: "Password reset link has been sent to your email",
     })
 
 
 


   }
   catch(error){
         console.log(error.message);
         return res.status(500).json({
              success: false,
              message: "Something went wrong while generating reset password token",
         });
   }



    
}

//resetPassword

exports.resetPassword = async (req, res) => {

    try{
                // data fetching from req body
        const { password, confirmPassword, token } = req.body;

        //validation
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching",
            });
        }
        //get userdetails from db using token
        const userdetails = await User.findOne({token: token});

        // if no entry - invalid token
        if(!userdetails) {
            return res.json({
                success: false,
                message: "Invalid token",
            });
        }
        // token time check
        if(userdetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token expired, please regenrate your token",
            });
        }
        // hash password
        await User.findByIdAndUpdate(
            {token: token},
            {password: hasedPasword},
            {new: true},
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    }

    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
}