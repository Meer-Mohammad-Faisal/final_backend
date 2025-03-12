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








async function uploadFileTOCloudinary(file,folder) {
    const options = {folder};
    return await cloudinary.uploader.upload(file.tempFilePath);
   
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






