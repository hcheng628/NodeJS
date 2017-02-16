const http = require('request');

var getAddressInfo = (inAddress, callback) => {
    http({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(inAddress)}`,
        json: true,
        proxy: 'http://10.110.17.6:8080'
    },(error, resp, body) => {
        if(error != null){
            console.log('CONNECTION_FAIL');
            callback({
                status: 'CONNECTION_FAIL',
                message: 'Cannot Connect to Google API'
                }, null
            );
        }else if(resp.statusCode == 200 && body.status == 'ZERO_RESULTS'){
            console.log('SUCCESS_BUT_NO_RESULT' + body.status);
            callback(null, {
                status: 'SUCCESS_BUT_NO_RESULT',
                message: 'Zero Result from Google Geo API',
                }
            );
        }else if(resp.statusCode == 200 && body.status == 'OK'){
            console.log('SUCCESS');
            callback(null, {
                status: 'SUCCESS',
                message: 'Result(s) from Google Geo API',
                location: body.results[0].formatted_address,
                location_types: body.results[0].types,
                location_type: body.results[0].location_type,
                lat: body.results[0].geometry.location.lat,
                lng: body.results[0].geometry.location.lng
            });
        }
    })
}

var getWeatherInfo = (inGeo, callback) => {
    var lat = inGeo.lat;
    var lng = inGeo.lng;
    var publicKey = '9be2b7a5191527ce53b1b8fe5c484913';

    http({
        url: `https://api.darksky.net/forecast/${publicKey}/${lat},${lng}`,
        json: true,
        proxy: 'http://10.110.17.6:8080'
    },(error, resp, body) => {
        if(error != null){
            console.log('CONNECTION_FAIL');
            callback({
                status: 'CONNECTION_FAIL',
                message: 'Cannot Connect to Forecast IO API'
                }, null
            );
        }else if(resp.statusCode == 400){
            console.log('Fetch_Weather_Information_Failed');
            callback(null, {
                status: 'Fetch_Weather_Information_Failed',
                message: 'Fetch Weather Information Failed',
                }
            );
        }else if(resp.statusCode == 200){
            console.log('SUCCESS');
            callback(null, {
                status: 'SUCCESS',
                message: 'Result(s) from Forecast IO API',
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        }
    })
}


// 
// https://api.darksky.net/forecast/9be2b7a5191527ce53b1b8fe5c484913/33.82,-84,32
module.exports = {
    getAddressInfo,
    getWeatherInfo
}