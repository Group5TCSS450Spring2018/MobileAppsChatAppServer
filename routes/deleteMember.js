const express = require('express');
const FormData = require("form-data");
const bodyParser = require("body-parser");

let db = require('../utilities/utils').db;
let getHash = require('../utilities/utils').getHash;

var router = express.Router();
router.use(bodyParser.json());

router.post('/', (req, res) => {
    // currently you only need your username and password to delete the member
    // but more can be added later
    let username = req.body['username'];
    let password = req.body['password'];
    if (username && password) {
        db.one('SELECT Password, Salt FROM Members WHERE Username=$1', [username])
            .then(row => {
                let salt = row['salt'];
                let salted_pw = getHash(password, salt);
                let isPasswordCorrect = salted_pw === row['password'];

                if (isPasswordCorrect) {
                    db.none('DELETE FROM Members WHERE Username=$1 AND Password=$2', [username, salted_pw])
                        .then(row => {
                            res.send({
                                success: true,
                                message: "Deleted " + username + " from database!"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.send({
                                success: false,
                                message: "Unable to delete " + username + " from database!",
                                error: err
                            });
                        });
                } else {
                    console.log("Password hashes did not match up!");
                    res.send({
                        success: false,
                        message: "Incorrect Credentials!"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    success: false,
                    message: "Incorrect Credentials!",
                    error: err
                });
            });
    } else {
        res.send({
            success: false,
            message: "Credentials Missing!"
        });
    }
});

module.exports = router;