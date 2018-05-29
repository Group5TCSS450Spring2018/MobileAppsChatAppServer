/**
 * Resends verification code for the verification process if user didn't receive email or waited too long.
 */
//express is the framework we're going to use to handle requests
const express = require('express');

const delay = require('delay');
//Create a new instance of express
const app = express();

//Create connection to Heroku Database
let db = require('../utilities/utils').db;
let sendEmail = require('../utilities/utils').sendEmail;
var router = express.Router();

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

router.post("/", (req, res) => {
    let username = req.body['username'];
    var verificationCode = Math.floor(1000 + Math.random() * 9000);
    var bodyStr = "VERIFICATION CODE: " + verificationCode.toString();
    let query = `UPDATE members SET verificationCode=$1 WHERE username=$2`;
    db.none(query, [verificationCode, username])
        .then(rows => {
            let getEmail = `SELECT email FROM members WHERE username=$1`;
            db.one(getEmail, [username])
                .then(row => {
                    sendEmail("team5mobileapps619@gmail.com", row['email'], "RESENT VERIFICATION", bodyStr);
                    res.send({
                        success: true,
                        message: "Email resent!"
                    })
                })
                .catch((err) => {
                    res.send({
                        success: false,
                        message: "User doesn't exist!"
                    })
                });
        })
        .catch((err) => {
            res.send({
                success: false,
                message: "Something went wrong",
                error: err
            })
        });
});


module.exports = router;