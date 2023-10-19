const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticator')
const task_manipulation_controller = require('./task-manipul-controller')
const tasks_controller = require('./tasks-controller')
const task_details_controller = require('./task-details-controller')

router.get("/ground-truth-editor/tasks/:page", authenticate, tasks_controller.get_tasks_of_page);

router.get("/ground-truth-editor/task/image/:filename", authenticate, task_details_controller.get_task_image);
router.get("/ground-truth-editor/task/text/:filename", authenticate, task_details_controller.get_task_text);
router.get("/ground-truth-editor/task/date/:filename", authenticate, task_details_controller.get_task_mod_date);

router.put("/ground-truth-editor/task/save", authenticate, task_manipulation_controller.save_edits);
router.get("/ground-truth-editor/task/revert/:filename", authenticate, task_manipulation_controller.revert);
router.put("/ground-truth-editor/task/unreadable", authenticate, task_manipulation_controller.mark_unreadable);

module.exports = router;