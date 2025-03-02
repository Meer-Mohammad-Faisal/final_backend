// import the model
const Todo = require("../models/Todo");

// define route handler

exports.deleteTodo = async(req,res) => {
    try {
        // finding id
        const {id} = req.params;

        // deleting
        await Todo.findOneAndDelete(id);

        // sending response
        res.json ({
            success: true,
            message: "Todo deleted",

        })

        
    }
    catch(err) {
        console.error(err);
        res.status(500)
        .json({
            success: false,
            error: err.message,
            message: 'Server Error',
        });
    }
}


