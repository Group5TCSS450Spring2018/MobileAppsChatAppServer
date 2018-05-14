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
    let username_a = req.body['username_a'];
    let username_b = req.body['username_b'];
    if(!username_a || !username_b ) {
        console.log("help");
        res.send({
            success: false,
            error: "Username a and Username b are empty"
        });
        return;
    }
    let insert = `DELETE FROM contacts
        WHERE memberid_a = (SELECT memberid FROM members WHERE username= $1) AND memberid_b = (SELECT memberid FROM members WHERE username=$2) AND verified=0`;
    db.none(insert, [username_a, username_b])
        .then(() => {
            res.send({
                success: true
            });
        }).catch((err) => {
            //console.log(err);
            res.send({
                
                success: false,
                error: err
            });
        });
    
});


module.exports = router;