
let user_table_query = `CREATE TABLE IF NOT EXISTS USER (
	id	          INT 		     AUTO_INCREMENT  PRIMARY KEY,
	name          varchar(255) 	 NOT NULL,
	email         varchar(255)	 NOT NULL,
	username      varchar(255) 	 NOT NULL 	 UNIQUE,
	password      varchar(255) 	 NOT NULL,
	last_login_at TIMESTAMP 	 DEFAULT CURRENT_TIMESTAMP
)`

module.exports = user_table_query
