var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose_client} = require('./utils/mongoose.helper');
var {Todo} = require('./modules/todo');
var {User} = require('./modules/user');

const nodeApp_Port = process.env.PORT || 3000;

const statusCode_OK_200 = 200;
const statusCode_BadClientRequest_400 = 400;
const statusCode_NotFound_404 = 404;
const statusCode_ServerError_500 = 500;

const endpoint_ToDo_Save = '/todos';
const endpoint_ToDo_GetAll = '/todos';
const endpoint_ToDo_GetByID = '/todos/:id';
const endpoint_ToDo_UpdateByID = endpoint_ToDo_GetByID;
const endpoint_ToDo_DeleteByID = endpoint_ToDo_GetByID;
const endpoint_User_GetAll = '/todos';


var nodeApp = express();
nodeApp.use(bodyParser.json());


nodeApp.post(endpoint_ToDo_Save, (request, response)=>{
    // console.log('Entering: ' + endpoint_ToDo_Save + '.....');
    // console.log('Body Info: ' + JSON.stringify(request.body,undefined,2));

    var newTodo = new Todo({
        text: request.body.text
    });

    newTodo.save().then((doc)=>{
        // console.log(JSON.stringify(doc,undefined,2));
        response.send(doc);
    }, (error)=>{
        // console.log(JSON.stringify(error,undefined,2));
        response.status(statusCode_BadClientRequest_400).send(error);
    });
});

nodeApp.get(endpoint_ToDo_GetAll, (request, response)=>{
    // console.log('Entering: ' + endpoint_ToDo_GetAll + '.....');
    // console.log('Body Info: ' + JSON.stringify(request.body,undefined,2));

    Todo.find().then((todos)=>{
        // console.log("Todos: " + JSON.stringify(todos,undefined,2));
        response.send({todos});
    }).catch((error)=>{
        // console.log("Error: " + JSON.stringify(error,undefined,2));
        response.send({error});
    });
});

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

nodeApp.patch(endpoint_ToDo_UpdateByID,(request, response)=>{
  if(!ObjectID.isValid(request.params.id)){
    response.status(statusCode_BadClientRequest_400).send('Invalid ObjectID');
  }
  var updateDoc;
  Todo.findById(request.params.id).then((doc)=>{
    if(doc){
      updateDoc = doc;
    }else{
      response.status(statusCode_NotFound_404).send();
    }
  }).catch((err)=>{
    // console.log("Error Here :-(");
    response.status(statusCode_ServerError_500).send(err);
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
      response.status(statusCode_NotFound_404).send();
    }else{
      response.send(doc);
    }
  })
  .catch((err)=>{
    response.status(statusCode_ServerError_500).send(err);
  });
});

nodeApp.delete(endpoint_ToDo_DeleteByID,(request,response)=>{
  if(!ObjectID.isValid(request.params.id)){
    response.status(statusCode_BadClientRequest_400).send('Invalid ObjectID');
  }

  Todo.findByIdAndRemove({ _id: request.params.id}).then((doc)=>{
    if(doc == null){
      response.status(statusCode_NotFound_404).send();
    }else{
      response.send(doc);
    }
  }).catch((err)=>{
    response.status(statusCode_ServerError_500).send(err);
  });
});

nodeApp.listen(nodeApp_Port, ()=>{
    // console.log(`Node Application Up n' Running @ ${nodeApp_Port}`);
});

module.exports = {
    nodeApp
}
