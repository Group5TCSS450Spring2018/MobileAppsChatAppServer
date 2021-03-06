/**
 * Adds a chat for a particular user to communicate with 1 or many other members
 */

//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

var router = express.Router();

let db = require('../utilities/utils').db;

router.post('/', (req, res) => { 
    var chatname = req.body['chatname'];
    var members = req.body['members'];
    var theChatID = 0;
    let select = `SELECT MemberId FROM Members WHERE Username=$1`

    let insert = `INSERT INTO ChatMembers(ChatId, MemberId) 
            SELECT Chats.ChatId, Members.MemberId
            FROM Chats, Members
            WHERE Chats.Name=$1
            AND Members.Username=$2`;

    db.none('SELECT ChatId FROM Chats WHERE Name=$1', [chatname])
    .then(row => {
        db.none('INSERT INTO Chats(Name) VALUES($1)', [chatname])
        .then(row =>{
            db.tx(t => {
                var queries = members.map(user => {
                    return t.one(select, user)
                });
                return t.batch(queries);
            })
            .then(data => {
                db.tx(t => {
                    var queries = members.map(user => {
                        return t.none(insert, [chatname, user])
                    });
                    return t.batch(queries);
                })
                .then(data2 => {
                    db.one('SELECT ChatId FROM Chats WHERE Name=$1', [chatname])
                    .then(row => {
                        db.none(`INSERT INTO Messages(ChatID, Message, MemberID) 
                                    (SELECT $1, $2, MemberId FROM Members WHERE Username=$3)`, 
                                    [row['chatid'], "Hello Everyone! \"" + chatname + "\" Chat Created!", members[0]])
                        .then(misc => {
                            res.send({
                                success: true,
                                chatid: row['chatid'],
                                message: "Chat created and chat members added!"
                            });
                        })
                        .catch(err => {
                            res.send({
                                success: true,
                                message: "Issues with inserting initial message!",
                                error: err
                            })
                        });
                        
                    })
                    .catch(err => {
                        res.send({
                            success: false,
                            message: "WHAT HAPPEND??",
                            errror: err
                        });
                    });
                })
                .catch(err => {
                    res.send({
                        success: false,
                        message: "UNABLE TO ADD USERS TO CHAT!",
                        error: err
                    })   
                });
            })
            .catch(err => {
                db.none("DELETE FROM Chats WHERE Name=$1", [chatname])
                .then(row => {
                    res.send({
                        success: false,
                        message: "INVALID USERS!",
                        error: err
                    })
                })
                .catch(err => {
                    res.send({
                        success: false,
                        message: "SOMETHING AWFUL HAS HAPPENED!",
                        error: err
                    })
                });

            });
        })
        .catch(err => {
            res.send({
                success: false,
                message: "UNABLE TO CREATE CHAT!",
                error: err
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.send({
            success: false,
            message: "CHAT ALREADY EXISTS!",
            error: err
        })
    });
});
module.exports = router;