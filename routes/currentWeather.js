const API_KEY_WEATHER = process.env.WEATHER_UNDERGROUND_API_KEY;
const express = require('express');
const app = express();
//request module is needed to make a request to a web service
const request = require('request');
const util = require('util');
var router = express.Router();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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
    
    var url = `http://api.wunderground.com/api/${API_KEY_WEATHER}/conditions/bestfct/q/${location}.json`;
    console.log("URL IS: " + url);
    request(url, function(error, response, body){
        //console.log(response);
        var result = JSON.parse(body);
        if(error) {
            res.send(error);
        } else {
            var current = result.hasOwnProperty('current_observation');
            console.log("RESULT : " + current);
            if(current) {
                    var temp_f = result['current_observation']['temp_f'];
                    //var temp = result['temp_f'];
                    
                    var loc = result['current_observation']['observation_location']['full']
                    var i = result['current_observation']['icon']
                    var json = {
                        "temp_f":temp_f,

                        "location": loc,
                        "icon": i
                    }
                    console.log("LOCATION: " + location);
                    res.send(json);
            }
            
        }
    });
    
});
module.exports = router;