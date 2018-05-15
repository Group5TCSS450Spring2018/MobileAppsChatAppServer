node //express is the framework we're going to use to handle requests
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
    let query_a = `SELECT username, firstname, lastname, email
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
        AND verified=1
    )`;
    let query_b = `SELECT username, firstname, lastname, email 
                        FROM members 
                        WHERE memberid 
                        IN (
                            SELECT memberid_b 
                            FROM contacts 
                            WHERE memberid_a=(
                                SELECT memberid 
                                FROM members 
                                WHERE username=$1
                            ) 
                            AND verified=1
                        )`;

    db.manyOrNone(query_a, [username])
        .then(rows_a => {
            db.manyOrNone(query_b, [username])
                .then(rows_b => {
                    res.send({
                        connections_a: rows_a,
                        connections_b: rows_b
                    })
                })
                .catch((err) => {
                    res.send({
                        message: "Something went wrong",
                        error: err
                    })
                });
        })
        .catch((err) => {
            res.send({
                message: "Something went wrong",
                error: err
            })
        });
});


module.exports = router;