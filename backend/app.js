const express = require('express')
const morgan = require('morgan')
const cors = require("cors");

const db = require('./db_config')
const create_tables = require('./models/table_creator')
const login_route = require('./controllers-routes/login-controller-route/login-route')
const task_route = require('./controllers-routes/task-controller-route/task-route')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json(), cors())
app.use(morgan('dev'))

db.getConnection()
  .then((connection) => {
	create_tables(connection)
	.then(() =>
		app.listen(3000, () => { console.log('The Backend Server is now Listening to port 3000') })
	).catch(err => {
		console.log(err)
		process.exit(1)
	})
  })

app.use(login_route)
app.use(task_route)
