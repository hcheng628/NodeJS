var {User} = require('../modules/user');

var authenticate = (req, res, next) => {
  var token = req.get('x-auth');
  // console.log('Header Token: ' + token);
  User.findByToken(token)
  .then((user)=>{
    if(!user){
      return Promise.reject('No User Found with Given Token');
    }

    req.user = user;
    req.token = token;
    // console.log('req: ' + JSON.stringify(req,undefined,2));

    next();
  }).catch((err)=>{
    res.status(401).send(err);
  });
}

module.exports = {
  authenticate
}
