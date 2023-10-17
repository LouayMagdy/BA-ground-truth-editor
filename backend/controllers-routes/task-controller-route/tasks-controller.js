require('dotenv').config();

const db = require('../../db_config')
const task_service = require('../../services/tasks-service')
const {json} = require("express");

let get_tasks_of_page = async (req, res) => {
    let connection = await db.getConnection()
    let to_skip = process.env.page_size * req.params.page
    let tasks = await task_service.get_all_tasks(connection, to_skip)
    let max_page = await task_service.get_max_page(connection)
    await connection.release()
    res.json({entries: tasks, max_page})
}

module.exports = {
    get_tasks_of_page
}