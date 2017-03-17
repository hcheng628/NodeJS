var {ObjectId} = require('mongodb');
var {User} = require('../modules/user');
var mongoose = require('../utils/mongoose.helper');

var newUser = new User({
    email: 'supercheng2017@gmail.com'
});

// newUser.save().then((doc)=>{
//     console.log('Insert New User: ' + JSON.stringify(doc,undefined,2));
// }, (err)=>{
//     console.log('Error: ' + JSON.stringify(err,undefined,2));
// });

User.findById('58b64222764ebb7d0abbd186').then((doc)=>{
    if(doc){
        console.log("Found User: " + JSON.stringify(doc.email,undefined,2));
    }else{
        console.log("No Record Found");
    }
}, (err)=>{
    console.log('Error: ' + JSON.stringify(err,undefined,2));
});

User.findById('58b64222764ebb7d0abbd185').then((doc)=>{
    if(doc){
        console.log("Found User: " + JSON.stringify(doc.email,undefined,2));
    }else{
        console.log("No Record Found");
    }
}, (err)=>{
    console.log('Error: ' + JSON.stringify(err,undefined,2));
});

User.findById('fjdajfkdls').then((doc)=>{
    if(doc){
        console.log("Found User: " + JSON.stringify(doc.email,undefined,2));
    }else{
        console.log("No Record Found");
    }
}, (err)=>{
    console.log('Error: ' + JSON.stringify(err,undefined,2));
});
