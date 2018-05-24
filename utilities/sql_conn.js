const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;
//Create connection to Heroku Database
const db =
    //pgp(process.env.DATABASE_URL);
    pgp('postgres://nhzxcbhdynnzdv:b0b8601fd2838b2e9f080b124e994b36f9ea4768305060da403acc6a7a3169ab@ec2-54-235-132-202.compute-1.amazonaws.com:5432/dbqh81fg04bk77');
if (!db) {
    console.log("Database doesn't exist!");
 process.exit(1);
}
module.exports = db;