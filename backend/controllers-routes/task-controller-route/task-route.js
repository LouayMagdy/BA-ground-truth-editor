const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticator')

router.get("/tasks", authenticate, );

module.exports = router;

