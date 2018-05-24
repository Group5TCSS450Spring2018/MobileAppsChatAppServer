const express = require('express');
//Create a new instance of express
const app = express();
const FormData = require("form-data");
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

let db = require('../utilities/utils').db;

let checkOneDayAgo = require('../utilities/utils').checkOneDayAgo;

let sendEmail = require('../utilities/utils').sendEmail;

var router = express.Router();

router.post('/', (req, res) => {
    let userCode = req.body['verifyCode'];
    let username = req.body['username'];
    let query = `SELECT email FROM members WHERE verificationcode=$1 AND verification=0 AND username=$2`
    if (userCode && username) {
        db.one(query, [userCode, username])
            .then(row => {
                db.none('UPDATE members SET verification=1 WHERE verificationcode=$1', [userCode])
                    .then(row2 => {
                        res.send({
                            success: true,
                            message: "verified!"
                        });
                    }).catch((err) => { // if updating caused an error, unsuccessful
                        res.send({
                            success: false,
                            error: err
                        });
                    });
            })
            .catch(err => {
                //if non verified member did not exist, was not successful
                res.send({
                    success: false,
                    error: err
                });
            });

    } else {
        res.send({
            success: false,
            message: "No code entered!"
        });
    }
});

module.exports = router;