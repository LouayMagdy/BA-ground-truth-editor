const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticator')
const task_manipulation_controller = require('./task-manipul-controller')
const tasks_controller = require('./tasks-controller')
const task_details_controller = require('./task-details-controller')

router.get("/revapp/tasks/:page", authenticate, tasks_controller.get_tasks_of_page);

router.get("/revapp/task/image/:filename", authenticate, task_details_controller.get_task_image);
router.get("/revapp/task/text/:filename", authenticate, task_details_controller.get_task_text);
router.get("/revapp/task/date/:filename", authenticate, task_details_controller.get_task_mod_date);

router.put("/revapp/task/save", authenticate, task_manipulation_controller.save_edits);
router.get("/revapp/task/revert/:filename", authenticate, task_manipulation_controller.revert);
router.put("/revapp/task/unreadable", authenticate, task_manipulation_controller.mark_unreadable);

module.exports = router;