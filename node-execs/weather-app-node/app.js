console.log("Starting app.js");

const yargs = require('yargs');
const geo_helper = require('./geocode/geocode');

var args = yargs.options({
  a:{
    demand: true,
    string: true,
    alias: 'Address',
    description: 'Given Address for Geo Information'
  }
}).help('h')
  .argv;

var address = args.a;

geo_helper.getAddressInfo(address, (error, resp) => {
  // console.log('Checking Error: ' + JSON.stringify(error, undefined, 2));
  // console.log('Checking Response: ' + JSON.stringify(resp, undefined, 2));
  if(error != null){
    console.log('Error: ' + JSON.stringify(error, undefined, 2));
  }else if(error == null && resp.status == 'SUCCESS_BUT_NO_RESULT'){
    console.log('Response: ' + JSON.stringify(resp, undefined, 2));
  }else if(error == null && resp.status == 'SUCCESS'){
    console.log('Response: ' + JSON.stringify(resp, undefined, 2));

    geo_helper.getWeatherInfo(resp, (weatherError, weatherResp) => {
      if(weatherError != null){
        console.log('Forecast IO Error: ' + JSON.stringify(weatherError, undefined, 2));
      }else if(weatherResp.status == 'Fetch_Weather_Information_Failed'){
        console.log('Fetch Weather Information Failed Error: ' + JSON.stringify(weatherResp, undefined, 2));
      }else if(weatherResp.status == 'SUCCESS'){
        console.log('Weather Information: ', JSON.stringify(weatherResp, undefined, 2));
      }
    });
  }
});