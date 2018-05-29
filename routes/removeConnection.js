/**
 * Allows users to remove a connection
 */

//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
//Create connection to Heroku Database
let db = require('../utilities/utils').db;
var router = express.Router();

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());
router.post('/', (req, res) => {
    let username = req.body['username'];
    let username_me = req.body['me']
    let remove = `DELETE FROM contacts 
    WHERE (memberid_a = (SELECT memberid FROM members WHERE username=$1) 
    AND memberid_b = (SELECT memberid FROM members WHERE username=$2))
    OR (memberid_b = (SELECT memberid FROM members WHERE username=$1) 
    AND memberid_a = (SELECT memberid FROM members WHERE username=$2))`;
    db.none(remove, [username, username_me])
        .then(() => {
            res.send({
                success: true
            });
        }).catch((err) => {
            console.log(err);
            res.send({
                
                success: false,
                error: err
            });
        });
    
});


module.exports = router;