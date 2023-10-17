require('dotenv').config();

const db = require('../../db_config')
const task_service = require('../../services/task-service')
const utils = require('../../services/utils')
const {json} = require("express");

let get_tasks_of_page = async (req, res) => {
    let connection = await db.getConnection()
    let to_skip = process.env.page_size * req.params.page
    let tasks = await task_service.get_all_tasks(connection, to_skip)
    let max_page = await task_service.get_max_page(connection)
    await connection.release()
    res.json({entries: tasks, max_page})
}

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

let save_edits = async (req, res) => {
    /***
    Logic: saves the user edits/revisions of a certain task
    ***/
    let connection = await db.getConnection()
    let is_edited = await utils.is_edited(connection, await utils.filename_to_id(connection, req.body.filename))
    if(is_edited){ /// revise
        let is_saved = await task_service.save_changes(connection, req.body)
        if(is_saved) res.json('Revised Successfully!')
        else res.json('Failed to Save your Reviews !!')
    }
    else{ /// edit
        let is_saved = await task_service.save_changes(connection, req.body)
        if(is_saved) res.json('Saved Successfully!')
        else res.json('Failed to Save your Modifications !!')
    }
}

module.exports = {
    get_tasks_of_page,
    get_task_image,
    get_task_text,
    get_task_mod_date,
    save_edits
}