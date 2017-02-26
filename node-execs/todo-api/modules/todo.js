var mongoose = require('mongoose');

const todoSchemaName = "Todo";

var todoSchema = {
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    }
};

var Todo = mongoose.model(todoSchemaName, todoSchema);

module.exports = {
    Todo
}