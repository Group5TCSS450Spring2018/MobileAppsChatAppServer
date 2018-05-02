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
    if (userCode) {
        db.one('SELECT email FROM members WHERE verificationcode=$1 AND verification=0', [userCode])
        .then(row => {
            db.one('UPDATE members SET verification=1 WHERE verificationcode=$1', [userCode])
            .then(row =>{
            })
            .catch((err) => {
                res.send({
                    success:false
                });
            });
            res.send({
                succse:true
            })
        })
        .catch((err) => {
            //If anything happened, it wasn't successful
            res.send({
                success: false
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