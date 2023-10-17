const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticator')
const task_controller = require('./task-controller')

router.get("/revapp/tasks/:page", authenticate, task_controller.get_tasks_of_page);

router.get("/revapp/task/image/:filename", authenticate, task_controller.get_task_image);
router.get("/revapp/task/text/:filename", authenticate, task_controller.get_task_text);
router.get("/revapp/task/date/:filename", authenticate, task_controller.get_task_mod_date);

router.put("/revapp/task/save", authenticate, task_controller.save_edits);
router.get("/revapp/task/revert/:filename", authenticate, task_controller.revert);
router.put("/revapp/task/unread", authenticate, );

module.exports = router;