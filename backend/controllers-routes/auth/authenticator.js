const jwt = require("jsonwebtoken");
require('dotenv').config();

const db = require("../../db_config")

let authenticate = async (req, res, next) =>{
    /***
    Logic:
     * 1. extract the JWT from auth-token header.
     * 2. if JWT not found ----> unauthenticated user.
     * 3. extract username and last_login_date from the JWT.
     * 4. look in USER table if there is a user with data extracted in (3).
     * 5. if a user found ----> the request he made is passed to its main controller.
     * 6. otherwise ----> return a DENIAL MESSAGE to the user
    ***/
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
    /***
    Logic: look in USER table if there is a user with data extracted from JWT (username, last_login_date).
    ***/
    let connection = await db.getConnection()
    return await connection.query(`SELECT * FROM USER
                                       WHERE username = "${user_of_token.username}" 
                                       AND last_login_at = "${user_of_token.last_login_at}"`)
}

module.exports = authenticate