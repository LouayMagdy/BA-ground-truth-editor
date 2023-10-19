const db = require('../../db_config')
const login_service = require('../../services/login-service')
const {generate_token} = require("../../services/login-service");

let login = async (req, res) => {
    /***
    returns the JWT in the auth-token header of the response message if the user is authenticated
    ***/
    try{
        let connection = await db.getConnection()
        // check if the DB has a user with this username
        let user = await login_service.find_one_user(connection, req.body.username)
        if(!user.length) {
            res.status(401).json({message: 'Not Registered!'})
            return
        }
        // check the correctness of the user password (authorization)
        let valid = await login_service.validate_password(user[0].password, req.body.password)
        if(!valid){
            res.status(401).json({message: 'Incorrect Password!!'})
            return
        }
        // editing the last login date of the user and using it to generate a JWT to be sent
        let logged = false
        while (!logged) logged = await login_service.login(connection, req.body)
        await connection.release()
        res.set('auth-token', generate_token((await login_service.find_one_user(connection, req.body.username))[0]))
        res.json({message: "Logged in Successfully!"})
    }
    catch (err){
        console.log(err)
        res.status(500).json({message: "Server Error"});
    }
}

module.exports = login