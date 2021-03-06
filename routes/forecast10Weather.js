/**
 * Retrieves the 10 day forecast for a particular location
 */

const API_KEY_WEATHER = process.env.WEATHER_UNDERGROUND_API_KEY;
const express = require('express');
const app = express();
//request module is needed to make a request to a web service
const request = require('request');
const util = require('util');
var router = express.Router();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
//var url = `http://api.wunderground.com/api/719e1681b31fb896/conditions/bestfct/q/98068.json`


router.post('/', (req, res) => {
    let location = req.body['location'];
    if(!location) {
        //console.log("help");
        res.send({
            success: false,
            error: "location not provided to url"
        });
        return;
    }
    var url = `http://api.wunderground.com/api/${API_KEY_WEATHER}/forecast10day/q/${location}.json`
    console.log(url);
    request(url, function(error, response, body){
        //console.log(response);
        var result = JSON.parse(body);
        if(error) {
            res.send(error);
        } else {
            
            console.log("\n"+result);
            //CLEAN THIS UP LATER.
            if(result.hasOwnProperty('forecast') && result['forecast'] != undefined) {
                // var d1 = result['forecast']['simpleforecast']['forecastday'][0]['high']['fahrenheit'];
                // var d2 = result['forecast']['simpleforecast']['forecastday'][1]['high']['fahrenheit'];
                // var d3 = result['forecast']['simpleforecast']['forecastday'][2]['high']['fahrenheit'];
                // var d4 = result['forecast']['simpleforecast']['forecastday'][3]['high']['fahrenheit'];
                // var d5 = result['forecast']['simpleforecast']['forecastday'][4]['high']['fahrenheit'];
                // var d6 = result['forecast']['simpleforecast']['forecastday'][5]['high']['fahrenheit'];
                // var d7 = result['forecast']['simpleforecast']['forecastday'][6]['high']['fahrenheit'];
                // var d8 = result['forecast']['simpleforecast']['forecastday'][7]['high']['fahrenheit'];
                // var d9 = result['forecast']['simpleforecast']['forecastday'][8]['high']['fahrenheit'];
                // var d10 = result['forecast']['simpleforecast']['forecastday'][9]['high']['fahrenheit'];

                // var date1 = result['forecast']['simpleforecast']['forecastday'][0]['date']['month'];
                // var date2 = result['forecast']['simpleforecast']['forecastday'][1]['date']['month'];
                // var date3 = result['forecast']['simpleforecast']['forecastday'][2]['date']['month'];
                // var date4 = result['forecast']['simpleforecast']['forecastday'][3]['date']['month'];
                // var date5 = result['forecast']['simpleforecast']['forecastday'][4]['date']['month'];
                // var date6 = result['forecast']['simpleforecast']['forecastday'][5]['date']['month'];
                // var date7 = result['forecast']['simpleforecast']['forecastday'][6]['date']['month'];
                // var date8 = result['forecast']['simpleforecast']['forecastday'][7]['date']['month'];
                // var date9 = result['forecast']['simpleforecast']['forecastday'][8]['date']['month'];
                // var date10 = result['forecast']['simpleforecast']['forecastday'][9]['date']['month'];

                // var m1 = result['forecast']['simpleforecast']['forecastday'][0]['date']['day'];
                // var m2 = result['forecast']['simpleforecast']['forecastday'][1]['date']['day'];
                // var m3 = result['forecast']['simpleforecast']['forecastday'][2]['date']['day'];
                // var m4 = result['forecast']['simpleforecast']['forecastday'][3]['date']['day'];
                // var m5 = result['forecast']['simpleforecast']['forecastday'][4]['date']['day'];
                // var m6 = result['forecast']['simpleforecast']['forecastday'][5]['date']['day'];
                // var m7 = result['forecast']['simpleforecast']['forecastday'][6]['date']['day'];
                // var m8 = result['forecast']['simpleforecast']['forecastday'][7]['date']['day'];
                // var m9 = result['forecast']['simpleforecast']['forecastday'][8]['date']['day'];
                // var m10 = result['forecast']['simpleforecast']['forecastday'][9]['date']['day'];

                var date = [];
                var temp = [];
                var icon = [];
                var tempLow = [];
                for(var i = 0; i<10; i++){
                    if (result['forecast']['simpleforecast']['forecastday'][i] != undefined) {
                        temp[i] = result['forecast']['simpleforecast']['forecastday'][i]['high']['fahrenheit'];
                        date[i] = result['forecast']['simpleforecast']['forecastday'][i]['date']['pretty'];
                        icon[i] = result['forecast']['simpleforecast']['forecastday'][i]['icon'];
                        tempLow[i] = result['forecast']['simpleforecast']['forecastday'][i]['low']['fahrenheit'];
                    }
                }
                

                var json = {
                    "temparray":temp,
                    "datearray":date,
                    "iconarray":icon,
                    "LOWtemparray":tempLow
                    // 'day1':date1+" "+m1+" "+d1,
                    // 'day2':date2+" "+m2+" "+d2,
                    // 'day3':date3+" "+m3+" "+d3,
                    // 'day4':date4+" "+m4+" "+d4,
                    // 'day5':date5+" "+m5+" "+d5,
                    // 'day6':date6+" "+m6+" "+d6,
                    // 'day7':date7+" "+m7+" "+d7,
                    // 'day8':date8+" "+m8+" "+d8,
                    // 'day9':date9+" "+m9+" "+d9,
                    // 'day10':date10+" "+m10+" "+d10
                }
                
                res.send(json);
            }
            
        }
    });
    
});
module.exports = router;