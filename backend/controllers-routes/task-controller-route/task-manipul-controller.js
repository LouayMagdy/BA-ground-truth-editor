require('dotenv').config();

const db = require('../../db_config')
const task_service = require('../../services/task-manipul-service')
const utils = require('../../services/utils')
const {json} = require("express");

let save_edits = async (req, res) => {
    /***
    Logic: saves the user edits/revisions of a certain task
    ***/
    let connection = await db.getConnection()
    let edit_num = await utils.get_edit_nums(connection, await utils.filename_to_id(connection, req.body.filename))
    let need_to_revise = edit_num === 1 && !(await utils.is_the_same_user(connection, req.body))
    if(need_to_revise){ /// revise
        let is_saved = await task_service.revise_changes(connection, req.body)
        await connection.release()
        await connection.end()
        if(is_saved) res.json({message:'Revised Successfully!'})
        else res.json({message: 'Failed to Save your Reviews !!'})
    }
    else if (!edit_num || (edit_num === 1 && !need_to_revise)) { /// edit
        let is_saved = await task_service.save_changes(connection, req.body)
        await connection.release()
        await connection.end()
        if(is_saved) res.json({message :'Saved Successfully!'})
        else res.json({message: 'Failed to Save your Modifications !!'})
    }
    else res.json({message: 'Already Revised'})
}

let change_page = async (req, res) => {
    let connection = await db.getConnection()
    let new_filename = await task_service.change_task(connection, req.params.direction, req.params.filename)
    await connection.release()
    await connection.end()
    res.json({filename: new_filename})
}

module.exports = {
    save_edits,
    change_page
    // revert,
    // mark_unreadable
}