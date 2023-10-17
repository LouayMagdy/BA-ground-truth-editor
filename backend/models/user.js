
let user_table_query = `CREATE TABLE IF NOT EXISTS USER (
	id	          INT 		     AUTO_INCREMENT  PRIMARY KEY,
	name          VARCHAR(255) 	 NOT NULL                   ,
	email         VARCHAR(255)	 NOT NULL                   ,
	username      VARCHAR(255) 	 NOT NULL 	     UNIQUE     ,
	password      VARCHAR(255) 	 NOT NULL                   ,
	last_login_at TIMESTAMP 	 DEFAULT CURRENT_TIMESTAMP
)`

module.exports = user_table_query
