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
    let query = `SELECT members.username, chatmembers.chatid, chats.name FROM members 
                INNER JOIN chatmembers ON members.memberid=chatmembers.memberid
                INNER JOIN chats ON chatmembers.chatid=chats.chatid
                WHERE members.memberid IN 
                (SELECT chatmembers.memberid FROM chatmembers WHERE chatmembers.chatid IN 
                (SELECT chats.chatid FROM chats WHERE chats.chatid IN 
                (SELECT chatmembers.chatid FROM chatmembers 
                    WHERE chatmembers.memberid = (SELECT members.memberid FROM members
                    WHERE username=$1))))`;
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