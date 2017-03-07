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

userSchema.methods.toJSON = function() {
  var user = this;
  var userObj = user.toObject();
  console.log("Overwrite toJson: " + JSON.stringify(userObj,undefined,2));
  return _.pick(userObj, ['_id','email']);
}

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

userSchema.statics.findByToken =  function(token) {
  console.log('In findByToken.....');
  var User = this;
  var decodeToken;
  try{
    console.log('In findByToken..... B');
    decodeToken = jwt.verify(token, 'user_sercet');
  } catch(err){
    console.log('In findByToken.....C');
    return Promise.reject();
  }
  console.log('In findByToken..... AA');
  return User.findOne({
    '_id': decodeToken._id,
    'tokens.access': decodeToken.access,
    'tokens.token': decodeToken.token
  })
  .then((user)=> {
    console.log('fetching DB user: ' + JSON.stringify(user,undefined,2));
    if(!user) {
      console.log('In findByToken..... BB');
      return Promise.reject('HAHAHAH');
    }
    return user;
  }).catch((err)=>{
    console.log('In findByToken..... ZZ' + JSON.stringify(err,undefined,2));
    return err;
  });
};


var User = mongoose.model(userSchemaName, userSchema);



module.exports = {
    User
}
