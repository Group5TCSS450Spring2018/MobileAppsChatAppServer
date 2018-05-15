//express is the framework we're going to use to handle requests
const express = require('express');

const delay = require('delay');
//Create a new instance of express
const app = express();

//Create connection to Heroku Database
let db = require('../utilities/utils').db;
var router = express.Router();

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

router.post("/", (req, res) => {
    let username_a = req.body['username_a'];
    let username_b = req.body['username_b'];
    let params = [username_a, username_b];
    let query = `SELECT chatid FROM chatmembers 
    WHERE chatid IN (SELECT chatid FROM chatmembers WHERE memberid=(SELECT memberid FROM members WHERE username=$1)) 
    AND chatid IN (SELECT chatid FROM chatmembers WHERE memberid=(SELECT memberid FROM members WHERE username=$2))`
    //`2=SELECT COUNT(*) FROM chatmembers WHERE memberid=ANY()`
    db.manyOrNone(query, params)
        .then(rows => {
            var result = [];
            var counts = {};
            for (var i = 0; i < rows.length; i++) {
                var num = rows[i]['chatid'];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }
            rows.forEach(element => {
                let chatid = element['chatid'];
                if (!result.includes(chatid) && counts[chatid]===2) {
                    result.push(chatid);
                }
            });
            if (result.length === 0) {
                res.send({
                    success: false,
                    chatid: result,
                    message: "There is not an individual chat between the two users."
                })
            } else if (result.length > 1) {
                res.send({
                    success: false,
                    chatid: result,
                    message: "There are more than one individual chat between two users."
                })
            } else {
                res.send({
                    success: true,
                    chatid: result[0]
                })
            }
            
        })
        .catch((err) => {
            res.send({
                message: "Something went wrong",
                error: err
            })
        });
});


module.exports = router;