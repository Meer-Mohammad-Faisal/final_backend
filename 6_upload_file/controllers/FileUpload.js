const File = require("../models/File");

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