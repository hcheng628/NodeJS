const http = require('request');

var geocodeAddress = (givenAddress, callback) => {
    http({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(givenAddress),
    json: true
},(error,resp,body)=>{
    if(error != null){
        console.log("Cannot Connect to Google API");
        callback( {
            Status: 'HTTP_ERROR',
            Message: 'Cannot Connect to Google API'
        });
    }else if(body.status === 'ZERO_RESULTS'){
        console.log("No Result Found");
        callback( {
            Status: 'ZERO_RESULTS',
            Message: 'No Result Found'
        });
    }else if(JSON.stringify(resp.statusCode) == 200 && body.status== 'OK'){
        console.log("Given Address: " + body.results[0].formatted_address);
        // console.log("Lat: " + body.results[0].geometry.location.lat);
        // console.log("Lng: " + body.results[0].geometry.location.lng);
        callback( {
            Status: 'OK',
            Address: body.results[0].formatted_address,
            Lat: body.results[0].geometry.location.lat,
            Lng: body.results[0].geometry.location.lng
        });   
    }
});
}

module.exports = {
    geocodeAddress
}