/**
 * Get all the messages for a particular user in a particular chat.
 */
//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;
var router = express.Router();

router.get("/", (req, res) => {
    let chatid = req.query['chatid'];
    let after = req.query['after'];
    let query = `SELECT members.username, messages.message, to_char(Messages.Timestamp AT TIME ZONE 'PDT', 'YYYY-MM-DD HH24:MI:SS.US' ) AS Timestamp FROM messages 
                INNER JOIN members ON messages.memberid=members.memberid
                WHERE messages.chatid=(SELECT chats.chatid FROM chats WHERE chats.chatid=$1)
                ORDER BY messages.timestamp ASC`;
    db.manyOrNone(query, [chatid])
        .then((rows) => {
            res.send({
                messages: rows
            })
        }).catch((err) => {
            res.send({
                success: false,
                error: err
            })
        });
});
module.exports = router;