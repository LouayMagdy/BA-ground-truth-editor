// importing maria db
const mariadb = require('mariadb')

// creating a connection pool
const pool = mariadb.createPool({
	host: "172.17.0.2",
	user: "root",
	password: "pass",
	database: "revapp"
});

module.exports = pool
