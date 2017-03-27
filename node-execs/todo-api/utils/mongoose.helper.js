var mongoose_client = require('mongoose');

// mongodb setup --- start
var mongodb_protocol = 'mongodb';
// var mongodb_url_remote = '159.203.206.215';
// var mongodb_url_local = 'localhost';
// var mongodb_port = '27017';
// var mongodb_collection = 'ToDo';
// mongodb setup --- end

mongoose_client.Promise = global.Promise;
mongoose_client.connect(`${mongodb_protocol}://${process.env.MONGODB_URI}:${process.env.MONGODB_PORT}/${process.env.MONGODB_COLLECTION}`);

module.exports = {
    mongoose_client
}
