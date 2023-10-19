require('dotenv').config();

const db = require('../../db_config')
const task_service = require('../../services/tasks-service')
const {json} = require("express");

let get_tasks_of_page = async (req, res) => {
    let connection = await db.getConnection()
    let min = process.env.page_size * req.params.page
    let max = process.env.page_size * (req.params.page + 1)
    let tasks = await task_service.get_all_tasks(connection, min, max)
    let max_page = await task_service.get_max_page(connection)
    await connection.release()
    await connection.end()
    console.log({entries: tasks, max_page})
    res.json({entries: tasks, max_page})
}

module.exports = {
    get_tasks_of_page
}