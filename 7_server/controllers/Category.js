const Category = require("../models/Category");

exports.createCategory = async (req, res) => {

};






exports.showAllCategories = async (req, res) => {


};



// CATEGORY PAGE DETAILS KA HANDLER FUNCTION
exports.categoryPageDetails = async (req, res) => {
    try{
        // get categoryId from request body
        const {categoryId} = req.body;

        // get course for specified catogoryId
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
        // validation
        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "could not found the category",
            });
        };

        // get course for diffrent categoires
        const differentCategories = await Category.find({ _id: { $ne: categoryId } }).populate("courses").exec();


        // get top selling courses
        // HW write it on your code
        

        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            },
            message: "category page details fetched successfully",
           
        });

    }
    catch(error){
        console.error("Error finding category: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};