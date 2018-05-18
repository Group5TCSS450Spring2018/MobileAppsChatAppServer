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
var url = `http://api.wunderground.com/api/%s/%s/bestfct/q/%s.json`

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
    url = util.format(url, API_KEY_WEATHER, 'conditions', location);
    console.log(url);
    request(url, function(error, response, body){
        //console.log(response);
        var result = JSON.parse(body);
        if(error) {
            res.send(error);
        } else {
            var current = result.hasOwnProperty('current_observation');
            console.log(current);
            if(current) {
                    var temp_f = result['current_observation']['temp_f'];
                    //var temp = result['temp_f'];
                    
                    var loc = result['current_observation']['observation_location']['full']
                    var json = {
                        "temp_f":temp_f
                    }
                    console.log(location);
                    res.send(json);
            }
            
        }
    });
    
});
module.exports = router;