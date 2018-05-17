const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;
//Create connection to Heroku Database
const db =
    //pgp(process.env.DATABASE_URL);
    pgp('postgres://rknopqdrtyqmys:23f13f349047d4cdf167680278e147263a2cfc0de10b5871f0aded1d2dbf97a7@ec2-54-83-19-244.compute-1.amazonaws.com:5432/dai8c98gjvnfvv');
if (!db) {
    console.log("Database doesn't exist!");
 process.exit(1);
}
module.exports = db;