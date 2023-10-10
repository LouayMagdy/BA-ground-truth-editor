
let file_table_query = `CREATE TABLE IF NOT EXISTS FILE (
	id	 INT		AUTO_INCREMENT	PRIMARY KEY,
	filename VARCHAR(255)   NOT NULL        UNIQUE
)`

module.exports = file_table_query
