var mongoose = require('mongoose');

const userSchemaName = "User";

const userSchema = {
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1
    }
}

var User = mongoose.model(userSchemaName, userSchema);

module.exports = {
    User
}