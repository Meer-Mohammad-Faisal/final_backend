const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup route handler
exports.signup = async (req, res) => {
    try {
        // get data
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // secure password(password hashing)
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password"
            });
        }

        // create entry for user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User could not be registered, please try again later"
        });
    }
};


// login:
exports.login = async (req,res) => {
    try{
        // data fetch
        const {email, password} = req.body;

        //validation on email and password
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all the details carefully",

        });
    }

    // check for registered user
    const user = await User.findOne({email});
    // if not a registerd user
    if(!user) {
        return res.status(401).json({
            success: false,
            message:'User is not registered',
        })
    }

    const payload = {
        email:user.email,
        id:user._id,
        role:user.role,
    };

    // verify password and genrate a JWT token
    if(await bcrypt.compare(password, user.password)) {
        // password match:
        let token = jwt.sign(payload, 
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });


        
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date (Date.now() + 3 * 24 * 60 *60 * 1000),
            httpOnly: true,
        }

        res.cookie("fasialtoken", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User Logged in successfully",
        });
    }
    else{
        //password do not match
        return res.status(403).json({
            success:false,
            message:"Password incorrect",
        });
    }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure",
        });
    }

}