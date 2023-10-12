const db = require('../../db_config')
const login_service = require('../../services/login-service')
const {generate_token} = require("../../services/login-service");

let login = async (req, res) => {
    try{
        let connection = await db.getConnection()

        let user = await login_service.find_one_user(connection, req.body.username)
        if(!user.length) {
            res.status(401).json({token: 'Not Registered!'})
            return
        }

        let valid = await login_service.validate_password(user[0].password, req.body.password)
        if(!valid){
            res.status(401).json({token: 'Incorrect Password!!'})
            return
        }

        let logged = false
        while (!logged) logged = await login_service.login(connection, req.body)
        res.setHeader('auth-token', generate_token(connection, user[0])).json({message: "Logged in Successfully!"})
    }
    catch (err){
        console.log(err)
        res.status(500).json({message: "Server Error"});
    }
}

module.exports = login