const user_table_query = require('./user')
const file_table_query = require('./file')
const edit_table_query = require('./edit')


async function create_tables(connection) {
	console.log('Connection Established with MariaDB Successfully!')
	try {
		await connection.query(user_table_query)
		await connection.query(file_table_query)
		await connection.query(edit_table_query)
	} catch (err) {
		throw (`Error While Creating Tables in the DB!!:\n${err}`)
	} finally {
		if (connection) {
			connection.release()
			console.log('Connection released with MariaDB!')
		}
	}
}

module.exports = create_tables;
