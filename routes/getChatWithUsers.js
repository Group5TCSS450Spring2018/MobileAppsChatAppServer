/**
 * Group all users by individual chats.
 */

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
    let users = req.body['users'];
    
    let query = `SELECT chatid FROM chatmembers WHERE (SELECT memberid FROM members WHERE username IN VALUES($1)) GROUP BY chatid HAVING count(*)=$2`;

    db.manyOrNone(query, [users, users.length])
        .then(rows => {
            res.send({
                message: rows
            });
        })
        .catch(err => {
            res.send({
                error: err
            });
        });
    
});


module.exports = router;