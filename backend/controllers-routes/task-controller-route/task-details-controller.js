require('dotenv').config();

const db = require('../../db_config')
const task_service = require('../../services/task-detail-service')
const {json} = require("express");

let get_task_image = (req, res) => {
    /***
     returns: the image (file) assigned with each task
     ***/
    res.sendFile(`./${req.params.filename}`, {root: process.env.file_store})
}

let get_task_text = async (req, res) => {
    /***
     returns: the text attached with the last edit (modification / revision) of the task
     ***/
    let connection = await db.getConnection()
    let text_readable = await task_service.get_task_text_readable(connection, req.params.filename)
    await connection.release()
    await connection.end()
    res.json(text_readable)
}

let get_task_history = async (req, res) => {
    /***
     returns: the modification and the revision dates of the task
     ***/
    let connection = await db.getConnection()
    let dates = await task_service.get_task_history(connection, req.params.filename)
    await connection.release()
    await connection.end()
    res.json(dates)
}

let get_task_number = async (req, res) => {
    /***
     returns: the task number and the max. tasks found
     ***/
    let connection = await db.getConnection()
    let numbers = await task_service.get_task_number(connection, req.params.filename)
    await connection.release()
    await connection.end()
    res.json(numbers)
}


let get_task_page = async (req, res) => {
    /***
    returns: page to which the filename belongs
    ***/
    let connection = await db.getConnection()
    let page = await task_service.get_task_page(connection, req.params.filename)
    await connection.release()
    await connection.end()
    res.json({page})
}


module.exports = {
    get_task_image,
    get_task_text,
    get_task_history,
    get_task_number,
    get_task_page
}