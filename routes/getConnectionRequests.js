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

router.get("/", (req, res) => {
    let username = req.query['username']; //memberid_a is the reciever of request
    let after = req.query['after'];
    let query = `SELECT username, firstname, lastname, email, contacts.timestamp
                 FROM members INNER JOIN contacts ON contacts.memberid_a=members.memberid
                    WHERE memberid 
                    IN (
                        SELECT memberid_b 
                        FROM contacts 
                        WHERE memberid_a=(
                            SELECT memberid 
                            FROM members 
                            WHERE username=$1
                        ) 
                        AND verified=0
                    )
                    ORDER BY contacts.timestamp DESC`;
    
    db.manyOrNone(query, [username, after])
    .then(rows => {
        res.send({
            success: true,
            recieved_requests: rows
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