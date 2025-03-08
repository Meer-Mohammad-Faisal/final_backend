// auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    try{
        // extract jwt token
        // pending : other ways to fetch token
        
        
        console.log("body", req.body.token);
        console.log("cookies",req.cookies.token);
        // console.log("header",req.header("Authorization"))  // why this is more secure?
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer", "");

        if(!token || token == undefined){
            return res.status(401).json({
                success: true,
                message: "Token missing",
            });
        }


        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            // why this?
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }
        next();
    } catch(error) {
        return res.status(401).json({
            success: true,
            message: "Somthing went wrong, while verifying the token",
        })
    }
}


exports.isStudent = (req,res, next) => {
    try{
        if(req.user.role != "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students",
            });
        }
        next();
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "User role can not matching",
        })
    }
}





exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role != "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students",
            });
        }
        next();
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "User role can not matching",
        })
    }
}