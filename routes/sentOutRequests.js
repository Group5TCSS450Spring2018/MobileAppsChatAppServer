/**
 * Gets all the requests sentout by a user.
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
    let username = req.body['username']; //memberid_a is the reciever of request
    let query = `SELECT username, firstname, lastname 
                    FROM members 
                    WHERE memberid 
                    IN (
                        SELECT memberid_a 
                        FROM contacts 
                        WHERE memberid_b=(
                            SELECT memberid 
                            FROM members 
                            WHERE username=$1
                        ) 
                        AND verified=0
                    )`;
    
    db.manyOrNone(query, [username])
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