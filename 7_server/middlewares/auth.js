const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


// auth
exports.auth = async (req, res, next) => {
    try{

        // extract token 
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        // if token missing, then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        // verify token
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded: ", decoded);
            req.user = decoded;
            
        }
        catch(err){
            // verify token failed
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        next();



    } catch(error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "somthign went wrong  while authenticating user",
        });
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected routes for students only",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected routes for instructors only",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected routes for admin only",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
}