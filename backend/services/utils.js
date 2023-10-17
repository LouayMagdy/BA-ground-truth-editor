
let get_edit_nums = async (connection, file_id) => {
    /***
    attributes:
     * connection: DB Connection promise
     * file_id: (String)
    returns:
     * How many times the file is edited via counting the number of users editing it
     * used in (save) and (mark unreadable) because:
     * - the first edit is considered the actual edit.
     * - the second edit is considered the revision.
     ***/
    let count = Number((await connection.query(`SELECT COUNT(DISTINCT user_id) AS 'count'
                                    FROM   EDIT
                                    WHERE  file_id = ${file_id}`))[0].count)
    console.log(`count: ${count}`)
    return count
}

let is_the_same_user = async (connection, edit) => {
    let user_id = await username_to_id(edit.modified)
    let file_id = await filename_to_id(edit.filename)
    let result = (await connection.query(`SELECT id
                                          FROM   EDIT
                                          WHERE  file_id = ${file_id} AND user_id = ${user_id}`))
    console.log(result, !!result.length, 'result length')
    return !!result.length
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
    filename_to_id,
    is_the_same_user
}
