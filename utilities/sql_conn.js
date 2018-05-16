const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;
//Create connection to Heroku Database
const db =
    pgp(process.env.DATABASE_URL);
if (!db) {
    console.log("Database doesn't exist!");
 process.exit(1);
}
module.exports = db;