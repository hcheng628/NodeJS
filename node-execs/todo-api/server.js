var {mongoose_client} = require('./utils/mongoose.helper');
var {Todo} = require('./modules/todo');
var {User} = require('./modules/user');


var newTodo = new Todo({
    text: 'Play Dota2',
    completed: false,
    completedAt: 2016
});

newTodo.save().then((doc)=>{
    console.log('Saved', JSON.stringify(doc, undefined, 2));
},(error)=>{
    console.log("Error", JSON.stringify(error, undefined, 2));
});

mongoose_client.connection.close()