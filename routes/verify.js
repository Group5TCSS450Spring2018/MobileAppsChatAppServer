const express = require('express');
//Create a new instance of express
const app = express();
const FormData = require("form-data");
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

let db = require('../utilities/utils').db;

var router = express.Router();

router.post('/', (req, res) => {
    let userCode = req.body['verifyCode'];
    let username = req.body['username'];
    if (userCode && username) {
        db.one('SELECT email FROM members WHERE verificationcode=$1 AND verification=0 AND username=$2', [userCode, username])
        .then(row => {
            db.none('UPDATE members SET verification=1 WHERE verificationcode=$1', [userCode])
            .then(row2 =>{
                sendEmail("team5mobileapps619@gmail.com", row['email'], "Email is verified!", "Thank you for using our app.");
                res.send({
                    success:true,
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