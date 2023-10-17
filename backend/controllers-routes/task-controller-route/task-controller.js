require('dotenv').config();

const db = require('../../db_config')
const task_service = require('../../services/task-service')
const {json} = require("express");

let get_tasks_of_page = async (req, res) => {
    let connection = await db.getConnection()
    let to_skip = process.env.page_size * req.params.page
    let tasks = await task_service.get_all_tasks(connection, to_skip)
    let max_page = await task_service.get_max_page(connection)
    res.json({entries: tasks, max_page})
}

let get_task_image = (req, res) => {
    res.sendFile(`./${req.params.filename}`, {root: process.env.file_store})
}

let get_task_text = async (req, res) => {
    let connection = await db.getConnection()
    let text = await task_service.get_task_text(connection, req.params.edit_text)
    res.json({edit_text: text})
}

module.exports = {
    get_tasks_of_page,
    get_task_image,
    get_task_text
}