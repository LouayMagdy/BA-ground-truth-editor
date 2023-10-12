const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticator')
const task_controller = require('./task-controller')

router.get("/revapp/tasks/:page", authenticate, task_controller.get_tasks_of_page);
router.post("/revapp/task/image", authenticate, );
router.post("/revapp/task/text", authenticate, );
router.post("/revapp/task/mod-date", authenticate, );
router.put("/revapp/task/save", authenticate, );
router.put("/revapp/task/revert", authenticate, );
router.put("/revapp/task/unread", authenticate, );

module.exports = router;