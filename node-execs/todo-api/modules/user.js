var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');

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
  console.log("Overwrite toJson Called");
  return _.pick(userObj, ['_id','email']);
}

userSchema.methods.generateAuthToken = function () {
  // console.log('In generateAuthToken Func..... ');
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access}, 'user_sercet').toString();
  // console.log('Generating Token: ' + token);
  user.tokens.push({access, token});
  // console.log('Checking user: ' + JSON.stringify(user, undefined, 2));
  return user.save().then(()=>{
    return token;
  });
};

userSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  }
  // , (err, numAffected)=>{
  //   if(err){
  //     return Promise.reject('Error Delete Token');
  //   }
  //   return Promise.resolve(numAffected);
  // }
);
}

userSchema.statics.findByCredentials = function(email, password){
  var User = this;
  return User.findOne({email: email}).then((user)=>{
    console.log(JSON.stringify(user, undefined, 2));

    if(user== null){
      return Promise.reject('No such E-mail Address Found');
    }

    return new Promise((resolve, reject)=>{
      bcrypt.compare(password, user.password, (err, res)=>{
        if(res === true){
          // console.log('Correct Password');
          resolve(user);
        }else{
          // console.log('InCorrect Password');
          reject('InCorrect Password');
        }
      });
    });

    // return new Promise((resolve, reject) => {
    //   // Use bcrypt.compare to compare password and user.password
    //   bcrypt.compare(password, user.password, (err, res) => {
    //     if (res === true) {
    //       resolve(user);
    //     } else {
    //       reject();
    //     }
    //   });
    // });

  });
};

userSchema.statics.findByToken =  function(token) {
  // console.log('In findByToken.....');
  var User = this;
  var decodeToken;
  try{
    // console.log('In findByToken..... B');
    decodeToken = jwt.verify(token, 'user_sercet');
  } catch(err){
    // console.log('In findByToken.....C');
    return Promise.reject('Can not verify Access Token');
  }
  // console.log('Checking decodeToken: ' + JSON.stringify(decodeToken,undefined,2));
  return User.findOne({
    '_id': decodeToken._id,
    'tokens.access': decodeToken.access,
    'tokens.token': token
  });
};

userSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      if(!err){
        bcrypt.hash(user.password, salt, (err, hash)=>{
          user.password = hash;
          next();
        });
      }
    });
  }else{
    next();
  }
});


var User = mongoose.model(userSchemaName, userSchema);



module.exports = {
    User
}
