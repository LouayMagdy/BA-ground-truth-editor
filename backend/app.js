const express = require('express')
const morgan = require('morgan')
const db = require('./db_config')

const create_tables = require('./models/table_creator')
const login_routes = require('./controllers-routes/login-routes')


const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
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
app.get('/greet', (req, res) => {
	res.send('welcome to the server')
})
app.use(login_routes)
