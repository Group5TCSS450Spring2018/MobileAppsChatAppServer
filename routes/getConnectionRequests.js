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
    let query = `SELECT memberid_b FROM contacts WHERE memberid_a=(SELECT memberid FROM members WHERE username=$1) AND verified=0`
    var connectionList = [];
    db.manyOrNone(query, [username])
        .then(rows => {
            let query_info = `SELECT username, firstname, lastname FROM members WHERE memberid=$1`
            for (var i = 0; i < rows.length; i++) {
                var requestee = rows[i]['memberid_b'];
                db.one(query_info, [requestee])
                    .then(row => {
                        connectionList.push(row);
                        res.send( {
                            message: rows
                        })
                    }).catch((err) => {
                        message: "Not a user!"
                    });
            }
        }).catch((err) => {
            res.send({
                message: "Something went wrong",
                error: err
            })
        });

    delay(1500)
    .then(() => {
        console.log(connectionList);
        res.send({
            connection: connectionList
        })
    }).catch((err) => {
        message: err
    });
});


module.exports = router;