const jwt = require("jsonwebtoken");
require('dotenv').config();

const db = require("../../db_config")

let authenticate = async (req, res, next) =>{
    try{
        const token = req.header("auth-token");
        if (!token) return res.status(401).json({message: "Access Denied"});
        try {
            let user_of_token = jwt.verify(token, process.env.token_secret);
            console.log(user_of_token)
            if(await verify_user(user_of_token)) next()
            else return res.status(401).json({message: "Access Denied"});
        }
        catch (err){
            return res.status(401).json({message: "Access Denied"});
        }
    }
    catch (err){
        res.status(500).json({message: "Server Error"});
    }
}
let verify_user = async (user_of_token) => {
    let connection = await db.getConnection()
    return await connection.query(`SELECT * FROM USER
                                       WHERE username = "${user_of_token.username}" 
                                       AND last_login_at = "${user_of_token.last_login_at}"`)
}

module.exports = authenticate