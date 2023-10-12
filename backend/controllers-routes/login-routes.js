const express = require('express')
const router = express.Router()
const login_controller = require('./login-contoller')


router.post('/revapp/login', login_controller)
module.exports = router