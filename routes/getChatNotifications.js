/**
 * Gets all the notifications for a individual chat.
 */

//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;
var router = express.Router();

router.get("/", (req, res) => {
    let username = req.query['username'];
    let query = `SELECT messages.message, messages.chatid, members.username, messages.timestamp, chats.name FROM messages
                 INNER JOIN chats ON chats.chatid=messages.chatid
                 INNER JOIN members ON messages.memberid=members.memberid
                 WHERE messages.chatid IN (SELECT chatid FROM chats WHERE chats.chatid IN 
                (SELECT chatmembers.chatid FROM chatmembers 
                WHERE chatmembers.memberid = (SELECT members.memberid FROM members
                WHERE username=$1))) ORDER BY timestamp DESC`;
    db.manyOrNone(query, [username])
        .then(row => {
            res.send({
                success: true,
                message: row
            })
        }).catch((err) => {
            res.send({
                success: false,
                error: err
            })
        });
});
module.exports = router;