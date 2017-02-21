const yargs = require('yargs');
const geo_helper = require('./geocode/geocode');
const axios = require('axios');



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

var geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`;


var weatherUrlBase = 'https://api.darksky.net/forecast/';
var publicKey = '9be2b7a5191527ce53b1b8fe5c484913';
var lat = '';
var lng = '';



axios.get(geoUrl).then( (geoResp) =>{
  // console.log(JSON.stringify(geoResp.data, undefined, 2));
  if(geoResp.data.status == 'ZERO_RESULTS'){
    throw new Error("Unable to Find the Given GEO Location Information.");
  }

  lat = geoResp.data.results[0].geometry.location.lat;
  lng = geoResp.data.results[0].geometry.location.lng;
  var weatherUrl = `${weatherUrlBase}${publicKey}/${lat},${lng}`;
  console.log(JSON.stringify(geoResp.data.results[0].formatted_address, undefined, 2));
  return axios.get(weatherUrl);
}).then( (weatherResp) =>{
  var tempObj = {
    temperature: weatherResp.data.currently.temperature,
    apparentTemperature: weatherResp.data.currently.apparentTemperature
  };
  console.log(JSON.stringify(tempObj, undefined, 2));

}).catch((error) =>{
  if(error.code === 'ENOTFOUND'){
    console.log("Unable to Connect to API");
  }else{
    console.log("Error Message: " + error.message);
  }
});
// axios
