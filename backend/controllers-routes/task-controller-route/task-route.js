const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticator')
const task_controller = require('./task-controller')

router.get("/revapp/tasks/:page", authenticate, task_controller.get_tasks_of_page);
router.get("/revapp/task/image/:filename", authenticate, task_controller.get_task_image);
router.get("/revapp/task/:edit_text", authenticate, task_controller.get_task_text);
router.post("/revapp/task/mod-date", authenticate, );
router.put("/revapp/task/save", authenticate, );
router.put("/revapp/task/revert", authenticate, );
router.put("/revapp/task/unread", authenticate, );

module.exports = router;