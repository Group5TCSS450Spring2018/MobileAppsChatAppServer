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
//Allows user to leave the chat forever
router.post("/", (req, res) => {
    let username = req.body['username'];
    let chatName = req.body['chatname']; 
    let query = `DELETE FROM chatmembers WHERE 
                chatmembers.memberid IN (SELECT members.memberid FROM members WHERE username=$1) 
                AND chatmembers.chatid IN (SELECT chats.chatid FROM chats WHERE chats.name=$2)`;
    db.none(query, [username, chatName])
    .then(rows => {
        res.send({
            success: true,
            message: "You have left!"
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