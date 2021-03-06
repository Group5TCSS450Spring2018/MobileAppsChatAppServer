//Get the connection to Heroku Database
let db = require('./sql_conn.js');
//We use this create the SHA256 hash
const crypto = require("crypto");
const FormData = require("form-data");
const validator = require('validator');
const emailExistence = require('email-existence');
const nodemailer = require('nodemailer');

/**
 * Sends an email to a user
 * @param {string} from1 user sending email 
 * @param {string} to1  receiver of email
 * @param {string} subject1 subject line
 * @param {string} message message of email
 */
function sendEmail(from1, to1, subject1, message) {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: from1, // generated ethereal user
                pass: "mobileteam5!" // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: from1, // sender address
            to: to1, // list of receivers
            subject: subject1, // Subject line
            text: message, // plain text body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
            // // Preview only available when sending through an Ethereal account
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            console.log("Message  sent");
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}

/**
 * Validates all user inputs sent in from the mobile app.
 * @param {string} first first name of user
 * @param {string} last last name of user
 * @param {string} username username of user
 * @param {string} email email for user
 * @param {string} password password for user
 */
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
    }
    if (password.length < 6 || password.length > 32 || email.length > 48 || first.length > 32 || last.length > 32) {
        isValidReg = false;
    }
    if (!validator.isAlphanumeric(first) || !validator.isAlphanumeric(last) || !validator.isAlphanumeric(username) || !validator.isAlphanumeric(password)) {
        isValidReg = false;
    }
    if (!validator.isEmail(email)) {
        isValidReg = false;
    }

    return isValidReg;
}

/**
 * Validates the password entered by user
 * @param {string} password 
 */
function validatePass(password) {
    var isValid = true;
    validator.trim(password);
    if (validator.isEmpty(password) || !validator.isAlphanumeric(password) || password.length < 6 || password.length > 32) {
        isValid = false;
    } 
    return isValid;
}
/**
 * Checks the previous day for verification
 * @param {string} timeRegistered 
 */
function checkOneDayAgo(timeRegistered) {
    const twentyFourHour = 1000 * 60 * 60 * 24;
    let twentyFourAgo = Date.now() - twentyFourHour;
    return timeRegistered > twentyFourAgo;
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
    db, getHash, sendEmail, validateInputs, checkOneDayAgo, validatePass
};