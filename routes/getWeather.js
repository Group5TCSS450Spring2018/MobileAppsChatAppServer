const API_KEY_WEATHER = process.env.WEATHER_UNDERGROUND_API_KEY;
const express = require('express');

//request module is needed to make a request to a web service
const request = require('request');
const util = require('util');
var router = express.Router();
//http://api.wunderground.com/api/719e1681b31fb896/conditions/bestfct/q/98068.json
var url = `http://api.wunderground.com/api/%s/%s/bestfct/q/%s.json`
util.format(url, API_KEY_WEATHER);
router.post('/getWeather', (req, res) => {
    let location = req.body['location'];
    if(!location) {
        //console.log("help");
        res.send({
            success: false,
            error: "location not provided to url"
        });
        return;
    }
    util.format(url, 'conditions', location);
    request(url, function(error, response, body){
        if(error) {
            res.send(error);
        } else {
            res.send(body);
        }
    });
    
});
module.exports = router;