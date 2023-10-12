const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
require('dotenv').config();
let secret_token = process.env.token_secret


let find_one_user = async (connection, username)=> {
    return await connection.query(`SELECT * FROM USER WHERE username = "${username}"`)
}

let login = async (connection, user)=> {
    let message = await connection.query(`UPDATE USER SET last_login_at = CURRENT_TIMESTAMP WHERE username = "${user.username}"`)
    return message.affectedRows > 0
}

let validate_password = async (usr_in_db_pass, usr_pass) => {
    return await bcrypt.compare(usr_pass, usr_in_db_pass)
}

let generate_token = (connection, user) => {
    return jwt.sign({ username: user.username, last_login_at: user.last_login_at}, secret_token)
}

module.exports = {
    find_one_user,
    login,
    validate_password,
    generate_token
}