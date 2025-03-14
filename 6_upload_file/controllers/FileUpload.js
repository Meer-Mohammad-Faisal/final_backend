const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// loacalfileupload -> handler function

exports.localFileUpload = async (req,res) => {
    try {

        // fetch file
        const file = req.files.file;
        console.log("FILE AAGYI ->",file );

        // create path where file will be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH->", path)


        // move file to path
        file.mv(path, (err)=> {
            console.log(err);
        });
        // create a successfull response
        res.json({
            success:true,
            message:"Local File Uploaded Successfully",
        });

    } catch(error) {

    }
}


// cloudinary ka setup

async function uploadFileTOCloudinary(file,folder) {
    const options = {folder};
    console.log("temp file path->", file.tempFilePath);

    if(quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload ka handler
exports.imageUpload = async (req,res) => {
    try{
        // data fetch krni hai
        const {name, tags, email} = req.body;
        console.log("DATA->", name, tags, email);

        const file = req.files.file;
        console.log("FILE->", file);

        // validation 
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedTypes.includes(fileType)) {
            return res.status(400).json({
                success:false,
                message:"Invalid File format",
            })
        }

        // file format supported hai...
        const response = await uploadFileTOCloudinary(file, "fileUpload");
        console.log("RESPONSE->", response);


        // db me entry save krni hai
        // const fileData = await File.create({
        //     name,
        //     imageUrl:response.secure_url,
        //     tags,
        //     email,
        // });



        // response
        res.json({
            success:true,
            message:"image Uploaded Successfully",
            // data:fileData,
        });

    }catch(error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message:"somthing went wrong",
        })
    }
}






// video upload ka handler
exports.videoUpload = async (req, res) => {
    try {
        // Data fetching
        const { name, tags, email } = req.body;
        console.log("DATA->", name, tags, email);

        if (!req.files || !req.files.videoFile) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const file = req.files.videoFile;
        console.log("FILE->", file);

        // Validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".").pop().toLowerCase();
        console.log("FILE TYPE->", fileType);

        if (!supportedTypes.includes(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "Invalid File format",
            });
        }

        // Upload to Cloudinary
        console.log("Uploading file to Cloudinary...");
        const response = await uploadFileTOCloudinary(file, "fileUpload");

        console.log("RESPONSE->", response);

        // Save to database
        const fileData = await File.create({
            name,
            videoUrl: response.secure_url,
            tags,
            email,
        });

        // Success response
        res.json({
            success: true,
            message: "Video Uploaded Successfully",
            videoUrl: response.secure_url,
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};





// imageSizeReduce -> handler function
exports.imageSizeReduce = async (req,res) => {
    try {
        // data fetch krni hai
        const {name, tags, email} = req.body;
        console.log("DATA->", name, tags, email);

        const file = req.files.file;
        console.log("FILE->", file);

        // validation 
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedTypes.includes(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:"Invalid File format",
            })
        }

        // file format supported hai...
        const response = await uploadFileTOCloudinary(file, "fileUpload", 90);
        console.log("RESPONSE->", response);

        // db me entry save krni hai
         const fileData = await File.create({
            name,
            imageUrl:response.secure_url,
            tags,
            email,
        });

        // response
        res.json({
            success:true,
            message:"image Uploaded Successfully",
            data:fileData,
        });




    } catch(error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message:"somthing went wrong",
        })
    }
}




