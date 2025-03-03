// controllers/CommentController.js

const Post  = require("../models/postModel");
const Comment = require("../models/commentModel");

// Business logic for creating a comment
exports.createComment = async (req, res) => {
    try {
        // Extract data from request body
        const { post, user, body } = req.body;

        // Validate that the post ID is provided
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // Create a new Comment object
        const comment = new Comment({ post, user, body });

        // Save the new comment into the database
        const savedComment = await comment.save();

        // Update the post: add the comment to the comments array
        const updatedPost = await Post.findByIdAndUpdate(
            post,
            { $push: { comments: savedComment._id } },
            { new: true }
        ).populate("comments");

        // If no post is found with the given ID, return a 404 error
        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found with the provided ID"
            });
        }

        // Return the updated post in the response
        res.status(200).json({
            success: true,
            data: updatedPost,
            message: `Comment added successfully to post ${post}`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while creating comment"
        });
    }
};
