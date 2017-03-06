var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

const userSchemaName = "User";
const userSchema = new mongoose.Schema({
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
    },

    tokens: [{
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }]
});

userSchema.methods.generateAuthToken = function () {
  console.log('In generateAuthToken Func..... ');
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access}, 'user_sercet').toString();
  console.log('Generating Token: ' + token);
  user.tokens.push({access, token});
  console.log('Checking user: ' + JSON.stringify(user, undefined, 2));
  return user.save().then(()=>{
    return token;
  });
};


var User = mongoose.model(userSchemaName, userSchema);



module.exports = {
    User
}
