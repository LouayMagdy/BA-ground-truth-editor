const db = require('../db_config')
const user_service = require('../services/login-service')

let login = async (req, res) => {
    let connection = await db.getConnection()
    let is_user_found = await user_service.is_user_found(connection, req.body)
    if(!is_user_found) res.status(401).json({token: 'Not Registered!'})
    let logged = false
    while (!logged) logged = await user_service.login(connection, req.body)
    res.json({message: "Logged in Successfully!"})
}

module.exports = login