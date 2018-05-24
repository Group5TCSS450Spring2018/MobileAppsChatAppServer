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
    
    var url = `http://api.wunderground.com/api/${API_KEY_WEATHER}/hourly/bestfct/q/${location}.json`
    console.log(url);
    request(url, function(error, response, body){
        //console.log(response);
        var result = JSON.parse(body);
        if(error) {
            res.send(error);
        } else {
            
            console.log("\n"+result);
            if(result.hasOwnProperty('hourly_forecast') && result['hourly_forecast'] != undefined) {
                    
                    var timearray = [];
                    var temparray = [];
                    var icon = [];
                    for(i=0; i<24; i++){
                        timearray[i] = result['hourly_forecast'][i]['FCTTIME']['civil'];
                        temparray[i] = result['hourly_forecast'][i]['temp']['english'];
                        icon[i] = result['hourly_forecast'][i]['icon'];
                    }
                    var json = {
                        "timearray":timearray,
                        "temparray":temparray,
                        "iconarray":icon
                    }
                    res.send(json);
                    
                
                    
                
            }
            
        }
    });
    
});
module.exports = router;
