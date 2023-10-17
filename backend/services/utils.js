
let get_edit_nums = async (connection, file_id) => {
    return (await connection.query(`SELECT COUNT(edit_text) AS 'count'
                                    FROM   EDIT
                                    WHERE  file_id = ${file_id}`))[0].count
}
let username_to_id = async (connection, username) => {
    /***
     attributes:
     * connection: DB Connection promise
     * username: (String)
     returns:
     * the user ID in USER Table
     ***/
    try{
        return (await connection.query(`SELECT id
                                        FROM   USER 
                                        WHERE  username = "${username}"`))[0].id
    }
    catch(err) {return 'NULL'}
}

let filename_to_id = async (connection, filename) => {
    /***
     attributes:
     * connection: DB Connection promise
     * filename: (String)
     returns:
     * the file ID in File Table
     ***/
    try{
        return (await connection.query(`SELECT id
                                        FROM   FILE 
                                        WHERE  filename = "${filename}"`))[0].id
    }
    catch(err) {return 'NULL'}
}


module.exports = {
    get_edit_nums,
    username_to_id,
    filename_to_id
}
