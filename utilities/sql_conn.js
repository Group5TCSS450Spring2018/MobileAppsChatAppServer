const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;
//Create connection to Heroku Database
const db =
    pgp('postgres://pwskpefutlpwwi:ba087d8645de9029c655658482ea67f81efd321f91947f40326ecd2d60b1736d@ec2-174-129-41-64.compute-1.amazonaws.com:5432/d4f04bb3t7e707');
if (!db) {
    console.log("SHAME! Follow the intructions and set your DATABASE_URL correctly");
 process.exit(1);
}
module.exports = db;