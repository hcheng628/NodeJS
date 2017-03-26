var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');
var {authenticate} = require('./middleware/authenticate');

var {mongoose_client} = require('./utils/mongoose.helper');
var {Todo} = require('./modules/todo');
var {User} = require('./modules/user');

const nodeApp_Port = process.env.PORT || 3000;

const statusCode_OK_200 = 200;
const statusCode_BadClientRequest_400 = 400;
const statusCode_NotFound_404 = 404;
const statusCode_ServerError_500 = 500;
const statusCode_UnAuthorized_401 = 401;

const endpoint_ToDo_Save = '/todos';
const endpoint_ToDo_GetAll = '/todos';
const endpoint_ToDo_GetByID = '/todos/:id';
const endpoint_ToDo_UpdateByID = endpoint_ToDo_GetByID;
const endpoint_ToDo_DeleteByID = endpoint_ToDo_GetByID;
const endpoint_User_GetAll = '/todos';

const endpoint_User_Save = '/users';
const endpoint_User_me_Get = '/users/me';
const endpoint_User_Login = '/users/login';
const endpoint_User_Logout = '/users/me/token';

var nodeApp = express();
nodeApp.use(bodyParser.json());


// Users Route  End End End End End Users Route
nodeApp.get(endpoint_User_me_Get, authenticate, (request, response)=> {
  // console.log('request: ' + JSON.stringify(request,undefined,2));
  // console.log('request: ', request);
  response.send(request.user);
});

nodeApp.delete(endpoint_User_Logout,authenticate, (request, response)=>{
  if(request.user){
    request.user.removeToken(request.token).then((res)=>{
      // console.log("Server: Okay" + JSON.stringify(res, undefined,2));
      response.send();
    }).catch((err)=>{
      // console.log("Server: " + err);
    });
  }else{
    response.status(404).send('User Not Found');
  }
});

nodeApp.post(endpoint_User_Login,(request, response) =>{
  var body = _.pick(request.body, ['email','password']);
  var thisUser = null;
  return User.findByCredentials(body.email, body.password)
  .then((user)=>{
    thisUser = user;
    return user.generateAuthToken();
  })
  .then((token)=>{
    response.header('x-auth', token).send(thisUser);
  })
  .catch((e)=>{
    response.status(500).send(e);
  });
  // console.log('User name: ' + body.email + ' Password: ' + body.password);
});

nodeApp.post(endpoint_User_Save,(request, response)=>{
  var newUser = new User({
    email: request.body.email,
    password: request.body.password
  });
  var globDoc;
  newUser.save()
  .then((doc)=>{
    // response.send({doc});
    globDoc = doc;
    return newUser.generateAuthToken();
    // .then((returnToken)=>{
    //   console.log('Return: ' + returnToken);
    //   console.log('Return newUser Update: ' + newUser.tokens[0].token);
    // });
    // console.log('Checking Token: ' + user.tokens[0].token);
  })
  .then((token)=>{
    // console.log('Token:' + token);
    // console.log('Then: .....');
    return response.header('x-auth', token).send(globDoc);
  })
  .catch((err)=>{
    // console.log('Error: .....');
    response.status(statusCode_ServerError_500).send({err});
  });
});
// Users Route  End End End End End Users Route







// Todos Route Start Start Start Start Start Todos Reoute
nodeApp.post(endpoint_ToDo_Save, authenticate, (request, response)=>{
    // console.log('Entering: ' + endpoint_ToDo_Save + '.....');
    // console.log('Body Info: ' + JSON.stringify(request.body,undefined,2));
    // console.log('Server endpoint_ToDo_Save Checking: ', request.user._id);
    var newTodo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });
    newTodo.save().then((doc)=>{
        // console.log(JSON.stringify(doc,undefined,2));
        response.send(doc);
    }, (error)=>{
        // console.log(JSON.stringify(error,undefined,2));
        response.status(statusCode_BadClientRequest_400).send(error);
    });
});

nodeApp.get(endpoint_ToDo_GetAll, authenticate, (request, response)=>{
    // console.log('Entering: ' + endpoint_ToDo_GetAll + '.....');
    // console.log('Body Info: ' + JSON.stringify(request.body,undefined,2));
    Todo.find({_creator: request.user._id.toHexString()}).then((todos)=>{
        // console.log("Todos: " + JSON.stringify(todos,undefined,2));
        response.send({todos});
    }).catch((error)=>{
        // console.log("Error: " + JSON.stringify(error,undefined,2));
        response.send({error});
    });
});



// Dont not if we should change this to a private route since we might going to share this with others
nodeApp.get(endpoint_ToDo_GetByID,(request, response)=>{
  // console.log("Checking ObjectID: " + request.params.id);
  if(!ObjectID.isValid(request.params.id)){
    response.status(statusCode_BadClientRequest_400).send('Invalid ObjectID');
  }
  Todo.findById(request.params.id).then((doc)=>{
    if(doc){
      response.send(doc);
    }else{
      response.status(statusCode_NotFound_404).send();
    }
  }).catch((err)=>{
      response.status(statusCode_ServerError_500).send();
  });
});
// Dont not if we should change this to a private route since we might going to share this with others



nodeApp.patch(endpoint_ToDo_UpdateByID, authenticate, (request, response)=>{
  if(!ObjectID.isValid(request.params.id)){
    return response.status(statusCode_BadClientRequest_400).send('Invalid ObjectID');
  }
  // console.log('----- Server endpoint_ToDo_UpdateByID Found Doc: ', JSON.stringify(request.user,undefined,2));
  var updateDoc;
  Todo.findOne({
    _id: request.params.id,
    _creator: request.user._id
  })
  .then((doc)=>{
    if(doc){
      updateDoc = doc;
      // console.log('----- Server endpoint_ToDo_UpdateByID Found Doc: ', JSON.stringify(updateDoc,undefined,2));
      // It means we can find this Todo
    }else{
      return response.status(statusCode_NotFound_404).send();
    }
  }).catch((err)=>{
    // console.log("Error Here :-(");
    return response.status(statusCode_ServerError_500).send(err);
  });

  var updateBody = _.pick(request.body, ['text','completed']);
  // console.log("Checking: " + JSON.stringify(updateBody,undefined,2));
  if(updateBody.completed == 'true'){
    updateBody.completedAt = new Date().getTime();
  }else{
    updateBody.completedAt = null;
    updateBody.completed = false;
  }
  // console.log("Updated: " + JSON.stringify(updateBody,undefined,2));
  Todo.findByIdAndUpdate(request.params.id,{ $set: updateBody},{new: true})
  .then((doc)=>{
    if(doc == null){
      return response.status(statusCode_NotFound_404).send();
    }else{
      response.send(doc);
    }
  })
  .catch((err)=>{
    response.status(statusCode_ServerError_500).send(err);
  });
});



nodeApp.delete(endpoint_ToDo_DeleteByID, authenticate, (request,response)=>{
  if(!ObjectID.isValid(request.params.id)){
    // console.log("This is Invalid ObjectID");
    return response.status(statusCode_BadClientRequest_400).send('Invalid ObjectID');
  }
  // console.log("This is Invalid ObjectID and Still Keep Going");
  Todo.findOneAndRemove({
    _id: request.params.id,
    _creator: request.user._id
  })
  .then((doc)=>{
    if(doc == null){
      return response.status(statusCode_NotFound_404).send();
    }else{
      response.send(doc);
    }
  }).catch((err)=>{
    response.status(statusCode_ServerError_500).send(err);
  });
});

// Todos Route End End End End End Todos Reoute



nodeApp.listen(nodeApp_Port, ()=>{
  console.log(`Node Application Up n' Running @ ${nodeApp_Port}`);
});

module.exports = {
    nodeApp
}
