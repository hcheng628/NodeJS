var {User} = require('../modules/user');

var authenticate = (req, res, next) => {
  var token = req.get('x-auth');
  // console.log('Header Token: ' + token);
  User.findByToken(token)
  .then((user)=>{
    // console.log('1 Middleware Checking' , JSON.stringify(user,undefined,2))
    if(!user){
      console.log('Middleware Checking' , JSON.stringify(user,undefined,2))
      return Promise.reject('No User Found with Given Token');
    }
    req.user = user;
    req.token = token;
    // console.log('Middleware Checking: ' + JSON.stringify(req,undefined,2));
    next();
  }).catch((err)=>{
    res.status(401).send(err);
  });
}

module.exports = {
  authenticate
}
