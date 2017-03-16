const {ObjectID} = require('mongodb');
const {Todo} = require('./../../modules/todo');
const {User} = require('./../../modules/user');

const jwt = require('jsonwebtoken')

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
  _id: userOneID,
  email: 'hcheng@gsw.edu',
  password: 'password1',
  tokens:[{
    access: 'auth',
    token: jwt.sign({ _id: userOneID.toHexString(), access: 'auth'}, 'user_sercet').toString()
  }]
},{
  _id: userTwoID,
  email: 'hcheng@spsu.edu',
  password: 'password2'
}];

const todos = [{
    _id: new ObjectID(),
    text: "1st Todo"
},{
    _id: new ObjectID(),
    text: "2nd Todo"
}];

const populateTodos = (done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
}

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(()=>done()).catch((err)=>{
    console.log(err);
  });
}

// const populateUsers = (done) => {
//   User.remove({}).then(() => {
//     var userOne = new User(users[0]).save();
//     var userTwo = new User(users[1]).save();
//
//     return Promise.all([userOne, userTwo])
//   }).then(() => done());
// };

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
