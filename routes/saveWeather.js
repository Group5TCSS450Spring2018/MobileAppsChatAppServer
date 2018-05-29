/**
 * Saves the weather requested by a user.
 */
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
    if(!zip) {
        let insert = `INSERT INTO locations(memberid, lat, long) 
        VALUES((SELECT memberid FROM members WHERE username = $1), $2, $3)`;
        db.none(insert, [username, lat, lng])
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
    }
    if(!lat||!lng){
        let insert1 = `INSERT INTO locations(memberid, zip) 
        VALUES((SELECT memberid FROM members WHERE username = $1), $2)`;
        db.none(insert1, [username, zip])
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
    }
});


module.exports = router;