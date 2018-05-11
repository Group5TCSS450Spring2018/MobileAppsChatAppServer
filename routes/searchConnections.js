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

var router = express.Router();

//search by username
router.post("/", (req, res) => {
    var search = req.body['search'];
    var username = req.body['username'];
    var likeSearch = search + '%';
    var query = "SELECT firstname, lastname, username, email FROM members WHERE (username ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1 OR email=$2) AND username!=$3";
    var params = [likeSearch, search, username];
    if (search && username) {
        db.manyOrNone(query, params)
        .then(rows => {
            res.send({
                success: true,
                message: rows
            });
        }).catch((err) => {
            res.send({
                message: "Invalid query!"
            });
        });
    } else {
        res.send({
            success: false,
            message: 'Search and username cannot be empty.'
        })
    }
});






module.exports = router;