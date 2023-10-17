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
    let text = await task_service.get_task_text(connection, req.params.filename)
    await connection.release()
    res.json({edit_text: text})
}

let get_task_mod_date = async (req, res) => {
    /***
     returns: the modification and the revision dates of the task
     ***/
    let connection = await db.getConnection()
    let dates = await task_service.get_task_mod_date(connection, req.params.filename)
    res.json(dates)
}

module.exports = {
    get_task_image,
    get_task_text,
    get_task_mod_date
}