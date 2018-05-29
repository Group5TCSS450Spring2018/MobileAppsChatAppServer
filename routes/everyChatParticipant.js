/**
 * Retrieves every person in every chat for a particular user from each chat for all recent chats
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
    let query = `SELECT chatmembers.chatid, members.username, chats.name FROM chatmembers
                 INNER JOIN members ON members.memberid=chatmembers.memberid
                 INNER JOIN chats ON chats.chatid=chatmembers.chatid
                 WHERE chatmembers.chatid IN 
                 (SELECT chatid FROM chatmembers WHERE memberid=(SELECT memberid FROM members WHERE username=$1))`
    db.manyOrNone(query, [username])
        .then(rows => {
            res.send({
                message: rows,
                success: true
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