//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

var router = express.Router();

let db = require('../utilities/utils').db;
let sendEmail = require('../utilities/utils').sendEmail;

router.post('/', (req, res) => {
    let email = req.body['email'];
    let query = `SELECT username FROM members WHERE email=$1 AND verification=1`;
    if (email) {
        db.one(query, [email])
            .then(row => {
                var verificationCode = Math.floor(1000 + Math.random() * 9000);
                var bodyStr = "VERIFICATION CODE: " + verificationCode.toString();
                sendEmail("team5mobileapps619@gmail.com", email, "Reset your password code!", bodyStr);
                let query_update = `UPDATE members SET verificationCode=$1 WHERE username=$2`;
                db.none(query_update, [verificationCode, row['username']])
                    .then(row2 => {
                        res.send({
                            success: true,
                            message: "Email sent to " + email
                        });
                    })
                    .catch((err) => {
                        res.send({
                            success: false,
                            message: "Failed to update!"
                        });
                    });
            })
            .catch((err) => {
                res.send({
                    success: false,
                    message: "No email found!"
                });
            });
    }
});


module.exports = router;