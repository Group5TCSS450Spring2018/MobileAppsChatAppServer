//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

const crypto = require("crypto");

var router = express.Router();

let db = require('../utilities/utils').db;
let getHash = require('../utilities/utils').getHash;

let checkPass = require('../utilities/utils').validatePass;

router.post('/', (req, res) => {
    var username = req.body['username'];
    var newPassword = req.body['newPassword'];
    var verifiedCode = req.body['verifyCode'];
    if (checkPass(newPassword)) {
        let salt = crypto.randomBytes(32).toString("hex");
        let salted_hash = getHash(newPassword, salt);
        db.none("UPDATE members SET password=$1, salt=$2 WHERE verificationCode=$3 AND username=$4", [salted_hash, salt, verifiedCode, username])
            .then(row => {
                db.one("SELECT firstname FROM members WHERE username=$1 AND verificationCode=$2", [username, verifiedCode])
                    .then(rowCheck => {
                        res.send({
                            message: "Password updated!"
                        });
                    })
                    .catch((err) => {
                        res.send({
                            message: "Verification code is wrong!"
                        });
                    })
            }).catch((err) => {
                res.send({
                    message: "Password failed to update! Wrong verification code!"
                });
            });
    } else {
        res.send({
            message: "Invalid password!"
        });
    }
});


module.exports = router;