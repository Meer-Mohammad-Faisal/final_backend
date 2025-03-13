const express = require("express");
const router = express.Router();

const {localFileUpload, imageUpload, videoUpload, imageSizeReduce} = require("../controllers/FileUpload");

// api route
router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);
router.post("/imageSizeReducer", imageSizeReduce);

module.exports = router;