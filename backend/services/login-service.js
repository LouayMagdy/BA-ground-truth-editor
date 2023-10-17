const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
require('dotenv').config();
let secret_token = process.env.token_secret


let find_one_user = async (connection, username)=> {
    /***
    attributes:
     * connection: DB Connection promise
     * username: string
    Logic:
     * finding one user with a given username to detect if the user is registered in our DB before login
    ***/
    return await connection.query(`SELECT * FROM USER WHERE username = "${username}"`)
}

let login = async (connection, user)=> {
    /***
     attributes:
      * connection: DB Connection promise
      * user: USER Object
     Logic:
      * updating the last_login_date of the authorized user at login. this date is used in generating JWT
     ***/
    let message = await connection.query(`UPDATE USER SET last_login_at = CURRENT_TIMESTAMP WHERE username = "${user.username}"`)
    return message.affectedRows > 0
}

let validate_password = async (usr_in_db_pass, usr_pass) => {
    /***
    attributes:
     * usr_in_db_pass: (String) the encrypted password stored in DB.
     * usr_pass: (String) the raw password entered by the user.
    Logic:
     * encrypting the usr_pass and checking if it the same as the encrypted one.
    ***/
    return await bcrypt.compare(usr_pass, usr_in_db_pass)
}

let generate_token = (user) => {
    /***
    attributes:
     * usr: USER Object.
    Logic:
     * Generating a JWT using the username and last_login_date of him:
    ***/
    return jwt.sign({ username: user.username, last_login_at: user.last_login_at}, secret_token)
}

module.exports = {
    find_one_user,
    login,
    validate_password,
    generate_token
}