var mongoose = require('mongoose');
var validator = require('validator');


const userSchemaName = "User";

const userSchema = {
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        validate: [ (val)=> {
            return validator.isEmail(val);
        },
        `This E-mail Address {VALUE} is Invalid`
        ]
    },
    password: {
      type: String,
      require: true,
      trim: true,
      minlength: 6
    }
}

var User = mongoose.model(userSchemaName, userSchema);

module.exports = {
    User
}
