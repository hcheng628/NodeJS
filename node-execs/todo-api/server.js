var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://159.203.206.215:27017/ToDo');

var todoSchema = {
    text: {
        type: String
    },
    completed:{
        type: Boolean
    },
    completedAt:{
        type: Number
    }
};

var Todo = mongoose.model('Todo', todoSchema);

var newTodo = new Todo({
    text: 'Play Dota',
    completed: false,
    completedAt: 2017
});

newTodo.save().then((doc)=>{
    console.log('Saved', JSON.stringify(doc, undefined, 2));
},(error)=>{
    console.log("Error", JSON.stringify(error, undefined, 2));
});

mongoose.connection.close()