const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendOTP
exports.sendOTP = async (req, res) => {
    try{
            // fetch email from request ki body
        const {email} = req.body;

        // check if the email is already registered
        const checkUserPresent = await User.findOne({email});

        // if user is already registered, return a response
        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

            // generate OTP
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            } )
            console.log("OTP: ", otp);

            // check unique otp or not
            const result = await OTP.findOne({otp: otp});

            while(result) {
                otp = otpGenrator(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                result = await OTP.findOne({otp: otp});
            }




            // save otp to database
            const otpPayload = {email, otp};

            // create an entry for OTP
            const otpBody = await OTP.create(otpPayload);
            console.log("OTP body: ", otpBody);

            // return response successfully
            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                otp,
            })
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: `Internal server error ${error.message}`,
            });
            
        }
}

// signUp---------------------------
exports.signUp = async (req, res) => {
        try {
            

            // data fetch from request ki body
            const {email,
                password,
                confirmPassword,
                otp,
                firstName,
                lastName,
                accountType,
                contactNumber,
            } = req.body;



            // validate krlo ki data sahi hai ya nahi
            if(!email || !password || !confirmPassword || !otp || !firstName || !lastName) {
                return res.status(403).json({
                    success: false,
                    message: "Please fill all the fields",
                });
            }


            // 2 password match krlo
            if(password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Password and confirm password do not match",
                });
            }



            // check if user already exists or not
            const existingUser = await User.findOne({email});
            if(existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already registered",
                });
            }


            // find most recent OTP stored for the user
            const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
            console.log("Recent OTP: ", recentOtp);
            // check if OTP is valid or not
            if(recentOtp.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "OTP not found",
                });
            } else if(otp !== recentOtp.otp) {
                // invalild otp
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }


            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);



            // entry create in db
            const profileDetails = await Profile.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null,
            });


            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                accountType,
                contactNumber,
                additionalDetails: profileDetails._id,
                image: `https://api.dicebear.com/5.x/fun-emoji/svg?seed=${firstName} ${lastName}`,

            })

            // return response
            return res.status(200).json({
                success: true,
                message: "User registered successfully",
                user,
            })

        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: `user cannot be registered. please try again ${error.message}`,
            });
        }
}

// Login--------------------------------------------
exports.login = async (req, res) => {
    try {
        // get data from request body
        const {email, password} = req.body;


        // validation of data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "Please fill all the fields",
            });
        }


        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }





        // genrate jwt token, after passwrod matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined; // remove password from response

        

            // create cookie and send resposne
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), // 3 days
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully",
                user,
                token,
            })
        }
        else{
            return res.status(401).json({
                success: false, 
                message: "Invalid email or password",
            });
        }

    }


    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `login failure, please try again`,
        });

    }
};


// changePassword
// homework
exports.changePassword = async (req, res) => {
    //get data from requrest body

    // get oldPassword, newPassword, confirmPassword

    // validate data

    // update pwd in DB

    // send mail - password changed successfully
    // return response
}


