var mongoClient = require('mongodb').MongoClient;
var mongoObjectID = require('mongodb').ObjectID;

var assert = require('assert');

var url_A = 'mongodb://159.203.206.215:27017/';
var url_B = 'mongodb://159.203.206.217:27017/';
var url_C = 'mongodb://159.203.206.219:27017/';
var url_D = 'mongodb://159.203.206.221:27017/';
var url_E = 'mongodb://159.203.206.223:27017/';
var url_F = 'mongodb://159.203.206.225:27017/';

var mongodbProjName = 'ToDoApp';

mongoClient.connect(url_A + mongodbProjName, (err, db) =>{
    assert.equal(null, err);
    console.log("Connected :-)");

    // Create --- Start
    // db.collection('Computers').insertOne({
    //     "brand": "Apple",
    //     "name": "MacBook Pro"
    // }, (err, res)=>{
    //     assert.equal(null,err);
    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });
    // Create --- End

    // Retrieve --- Start
    var objID = new mongoObjectID('58b220f3f078d424af9461bb');
    db.collection('Computers').find({_id: objID }).toArray().then((doc)=>{
        console.log('doc: ' + JSON.stringify(doc,undefined,2));
    },(err)=>{
        console.log('err', err);
    });


    // db.collection('Computers').find().count().then((count)=>{
    //     console.log('count: ' + count);
    // },(err)=>{
    //     console.log('err', err);
    // });
    // Retrieve --- End
    db.collection('Computers').updateOne(
        {
            _id: objID
        },
        {
            $set: {
                name: 'MacBook Pro 15'
            }
        },
        {
            returnOriginal: false
        }).then((resp) => {
            console.log("Response: " + JSON.stringify(resp, undefined, 2));
        });


    var objID = new mongoObjectID('58b220f3f078d424af9461bb');
    db.collection('Computers').find({_id: objID }).toArray().then((doc)=>{
        console.log('doc: ' + JSON.stringify(doc,undefined,2));
    },(err)=>{
        console.log('err', err);
    });


    db.close();
});