let is_user_found = async (connection, user) => {
    let db_user = await connection.query(`SELECT *        
                                          FROM USER
                                          WHERE username = "${user.username}" AND password = "${user.password}"`)
    return db_user.length !== 0
}

let login = async (connection, user) =>{
    let message = await connection.query(`UPDATE USER SET last_login_at = CURRENT_TIMESTAMP
                                    WHERE username = "${user.username}" AND password = "${user.password}"`)
    return message.affectedRows > 0
}

module.exports = {
    is_user_found,
    login
}