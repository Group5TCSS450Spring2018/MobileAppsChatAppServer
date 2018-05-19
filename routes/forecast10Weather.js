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
var url = `http://api.wunderground.com/api/${API_KEY_WEATHER}/forecast10day/bestfct/q/${location}.json`

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
    console.log(url);
    request(url, function(error, response, body){
        //console.log(response);
        var result = JSON.parse(body);
        if(error) {
            res.send(error);
        } else {
            result = result.hasOwnProperty('forecast');
            console.log("\n"+result);
            if(result) {
                //var p1 = ['result']['forecast'];
                //console.log(p1);
                    res.send(body);
                    
                
                    
                
            }
            
        }
    });
    
});
module.exports = router;