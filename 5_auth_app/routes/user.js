const express = require("express");
const router = express.Router();

const {login, signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middleware/auth");


router.post("/login", login);
router.post("/signup", signup);

// testing routes for single middleware
router.get("/test", auth, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for TEST",
    });
})

// protected routes
router.get("/student", auth, isStudent, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for students",
    });
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcom to the protected rout for admin",
    });
});





module.exports = router;