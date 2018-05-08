//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
const FormData = require("form-data");
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());
//Create connection to Heroku Database
let db = require('../utilities/utils').db;

router.post("/", (req, res) => {
    var username = req.body['username'];
    db.manyOrNone("SELECT firstname, lastname FROM members WHERE username LIKE %$1$", username)
    .then(rows => {
        res.send({
            message: rows
        });
    }).catch((err) => {
        res.send({
            message: "Invalid query!"
        });
    });
});






module.exports = router;