/**
 * Gets all the chat ids from each chat
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
    let username = req.body['username'];
    let query = `SELECT DISTINCT chatid, name FROM chats 
    WHERE chatid IN (SELECT chatid FROM chatmembers WHERE memberid=(SELECT memberid FROM members WHERE username=$1))`
    db.manyOrNone(query, [username])
        .then(rows => {
            res.send({
                success: true,
                message: rows
            })
        })
        .catch((err) => {
            res.send({
                message: "Something went wrong",
                error: err
            })
        });
});


module.exports = router;