const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;
//Create connection to Heroku Database
const db =
    pgp('postgres://maphtdfqxqlbbj:a58153c65894b0a307027d96bc58e7c5d18a87bb389114239982e4b57c96374e@ec2-54-225-200-15.compute-1.amazonaws.com:5432/df2mefvft8a9di');
if (!db) {
    console.log("Database doesn't exist!");
 process.exit(1);
}
module.exports = db;