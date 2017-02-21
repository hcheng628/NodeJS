// const http = require('request');
const yargs =  require('yargs');

const geo_helper = require('./geocode/geocode'); 


const args = yargs.options({
    a:{
        demand: true,
        string: true,
        alias: 'Address',
        describe: 'Given Address Weather Information'
    }
}).help('h').argv;

var inputAddress = args.a;

console.log('Input Address: ' + inputAddress);

var returnRes = geo_helper.geocodeAddress(inputAddress, callback =>{
    console.log(callback);
});

// http({
//     url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(inputAddress),
//     json: true
// },(error,resp,body)=>{
//     if(error != null){
//         console.log("Cannot Connect to Google API");
//     }else if(body.status === 'ZERO_RESULTS'){
//         console.log("No Result Found");
//     }else if(JSON.stringify(resp.statusCode) == 200 && body.status== 'OK'){
//         console.log("Given Address: " + body.results[0].formatted_address);
//         console.log("Lat: " + body.results[0].geometry.location.lat);
//         console.log("Lng: " + body.results[0].geometry.location.lng);        
//     }
// });
