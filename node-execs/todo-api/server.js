var express = require('express');
var bodyParser = require('body-parser');

var {mongoose_client} = require('./utils/mongoose.helper');
var {Todo} = require('./modules/todo');
var {User} = require('./modules/user');

const nodeApp_Port = process.env.PORT || 3000;

const statusCode_OK_200 = 200;
const statusCode_ServerError_500 = 500;
const statusCode_BadClientRequest_400 = 400;

const endpoint_ToDo_Save = '/todos';
const endpoint_ToDo_GetAll = '/todos';


var nodeApp = express();
nodeApp.use(bodyParser.json());


nodeApp.post(endpoint_ToDo_Save, (request, response)=>{
    console.log('Entering: ' + endpoint_ToDo_Save + '.....');    
    console.log('Body Info: ' + JSON.stringify(request.body,undefined,2));

    var newTodo = new Todo({
        text: request.body.text
    });
    
    newTodo.save().then((doc)=>{
        console.log(JSON.stringify(doc,undefined,2));
        response.status(statusCode_OK_200).send(doc);
    }, (error)=>{
        console.log(JSON.stringify(error,undefined,2));
        response.status(statusCode_BadClientRequest_400).send(error);
    });
    // mongoose_client.connection.close()
});

nodeApp.get(endpoint_ToDo_GetAll, (request, response)=>{
    console.log('Entering: ' + endpoint_ToDo_GetAll + '.....');    
    console.log('Body Info: ' + JSON.stringify(request.body,undefined,2));
    
    Todo.find().then((todos)=>{
        console.log("Todos: " + JSON.stringify(todos,undefined,2));
        response.send({todos});
    }).catch((error)=>{
        console.log("Error: " + JSON.stringify(error,undefined,2));
        response.send({error});
    });
    // mongoose_client.connection.close()
});

nodeApp.listen(nodeApp_Port, ()=>{
    console.log(`Node Application Up n' Running @ ${nodeApp_Port}`);
});

module.exports = {
    nodeApp
}