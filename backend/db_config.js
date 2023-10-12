const mariadb = require('mariadb')
require('dotenv').config();

const host = process.env.host
const user = process.env.user
const password = process.env.password
const database = process.env.database

// creating a connection pool
const pool = mariadb.createPool({
	host: host,
	user: user,
	password: password,
	database: database
});

module.exports = pool
