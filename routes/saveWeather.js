const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;
var router = express.Router();
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());
router.post('/', (req, res) => {
    let username = req.body['username'];
    //let nickname = req.body['nickname'];
    let lat = req.body['lat'];
    let lng = req.body['lng'];
    let zip = req.body['zip'];
    if(!username || !lat|| !lng|| !zip) {
        //console.log("help");
        res.send({
            success: false,
            error: "Field is empty."
        });
        return;
    }
    
    let insert = `INSERT INTO locations(memberid, lat, long, zip) 
        VALUES((SELECT memberid FROM members WHERE username = $1), $2, $3, $4)`;
    db.none(insert, [username, lat, lng, zip])
        .then(() => {
            res.send({
                success: true

            });
        }).catch((err) => {
            //console.log(err);
            res.send({
                
                success: false,
                error: err
            });
        });
    
});


module.exports = router;