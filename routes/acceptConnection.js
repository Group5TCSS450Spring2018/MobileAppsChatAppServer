/**
 * Accepts a connection request for a user which allows users to communicate between each other.
 */

//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;
var router = express.Router();

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

router.post('/', (req, res) => {
    let username_a = req.body['username_a'];
    let username_b = req.body['username_b'];
    let query = `SELECT memberid_a, memberid_b FROM contacts WHERE memberid_a=(SELECT memberid FROM members WHERE username=$1) 
                 AND memberid_b=(SELECT memberid FROM members WHERE username=$2)`
    db.one(query, [username_a, username_b])
        .then(row => {
            let query_update = `UPDATE contacts SET verified=1 WHERE memberid_a=$1 AND memberid_b=$2`
            db.none(query_update, [row['memberid_a'], row['memberid_b']])
                .then(row2 => {
                    res.send({
                        success: true,
                        message: "User added!"
                    });
                }).catch((err) => { // if updating caused an error, unsuccessful
                    res.send({
                        success: false,
                        error: err
                    });
                });
        }).catch((err) => {
            res.send({
                success: false,
                error: err
            });
        });
});

module.exports = router;