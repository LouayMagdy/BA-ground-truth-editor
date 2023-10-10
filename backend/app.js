const express = require('express')
const db = require('./db_config')
const create_tables = require('./models/table_creator')

const app = express()

db.getConnection()
  .then((conn) => {
	create_tables(conn)
	.then(() => {
		app.listen(3000)
		console.log('The Backend Server is now Listening to port 3000')
	})
	.catch(err => {
		console.log(err)
		process.exit(1)
	})
   })

