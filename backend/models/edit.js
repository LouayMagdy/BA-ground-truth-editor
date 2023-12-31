require('dotenv').config();

let edit_table_query = `CREATE TABLE IF NOT EXISTS EDIT (
	id	        INT		   AUTO_INCREMENT	 PRIMARY KEY,
	user_id	    INT                                     ,
	file_id	    INT		   NOT NULL                     ,
	readable    BOOLEAN	   DEFAULT  TRUE                ,
	edit_text   VARCHAR(4096)                           ,
	edited_at   TIMESTAMP  DEFAULT  CURRENT_TIMESTAMP   ,

	CONSTRAINT FK1 FOREIGN KEY(user_id) REFERENCES ${process.env.database}.USER(id) ON UPDATE CASCADE,
	CONSTRAINT FK2 FOREIGN KEY(file_id) REFERENCES ${process.env.database}.FILE(id) ON UPDATE CASCADE
)`

module.exports = edit_table_query
