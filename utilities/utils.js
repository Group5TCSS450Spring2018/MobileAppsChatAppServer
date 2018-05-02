//Get the connection to Heroku Database
let db = require('./sql_conn.js');
//We use this create the SHA256 hash
const crypto = require("crypto");
const FormData = require("form-data");
const validator = require('validator');
const emailExistence = require('email-existence');
function sendEmail(from, to, subject, message) {
    let form = new FormData();
    form.append("from", from);
    form.append("to", to);
    form.append("subject", subject);
    form.append("message", message);
    form.submit("http://cssgate.insttech.washington.edu/~cfb3/mail.php", (err,
        res) => {
        if (err) {
            console.error(err);
        } 
        //console.log(res);
    });
}


function validateInputs(first, last, username, email, password) {
    var isValidReg = true;
    validator.trim(first);
    validator.trim(last);
    validator.trim(username);
    validator.trim(email);
    validator.trim(password);
    if (validator.isEmpty(first) || validator.isEmpty(last) || validator.isEmpty(username) || validator.isEmpty(email)
        || validator.isEmpty(password)) {
            isValidReg = false;
            console.log('Empty field');
    }
    if (password.length < 6 || password.length > 32 || email.length > 48 || first.length > 32 || last.length > 32) {
        isValidReg = false;
        console.log('Password too short or something too long');
    }
    if (!validator.isAlphanumeric(first) || !validator.isAlphanumeric(last) || !validator.isAlphanumeric(username) || !validator.isAlphanumeric(password)) {
        isValidReg = false;
        console.log('Fuck you');
    }
    if (!validator.isEmail(email)) {
        isValidReg = false;
        console.log('Invalid email here');
    }
        // } else {
    //     emailExistence.check(email, function(error, response){
    //         console.log('res: '+response);
    //     });    
    // }

    return isValidReg;
}

/**
* Method to get a salted hash.
* We put this in its own method to keep consistency
* @param {string} pw the password to hash
* @param {string} salt the salt to use when hashing
*/
function getHash(pw, salt) {
    return crypto.createHash("sha256").update(pw + salt).digest("hex");
}
module.exports = {
    db, getHash, sendEmail, validateInputs
};