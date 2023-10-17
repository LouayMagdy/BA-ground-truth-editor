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
        if(is_saved) res.json({message:'Revised Successfully!'})
        else res.json({message: 'Failed to Save your Reviews !!'})
    }
    else if (!edit_num || (edit_num === 1 && !need_to_revise)) { /// edit
        let is_saved = await task_service.save_changes(connection, req.body)
        await connection.release()
        if(is_saved) res.json({message :'Saved Successfully!'})
        else res.json({message: 'Failed to Save your Modifications !!'})
    }
    else res.json({message: 'Already Revised'})
}

let revert = async (req, res) => {
    /***
    Logic: get the last saved user text assigned with a specific task.
    ***/
    let connection = await db.getConnection()
    let last_edit = await task_service.revert(connection, req.params.filename)
    await connection.release()
    res.json(last_edit)
}

let mark_unreadable = async (req, res) => {
    /***
    Logic: mark the task assigned with some file as unreadable
    ***/
    let connection = await db.getConnection()
    let edit_num = await utils.get_edit_nums(connection, await utils.filename_to_id(connection, req.body.filename))
    let need_to_revise = edit_num === 1 && !(await utils.is_the_same_user(connection, req.body))
    if (need_to_revise){
        let is_reverted = task_service.mark_unread_revise(connection, req.body)
        await connection.release()
        if(is_reverted) res.json({message :'Marked As Unreadable(2) Successfully!'})
        else res.json({message: 'Failed to Mark the file as Unreadable!!'})
    }
    else if(!edit_num || (edit_num === 1 && !need_to_revise)){
        let is_reverted = task_service.mark_unread_edit(connection, req.body)
        await connection.release()
        if(is_reverted) res.json({message :'Marked As Unreadable(1) Successfully!'})
        else res.json({message: 'Failed to Mark the file as Unreadable!!'})
    }
    else res.json({message: 'Already Revised'})
}

module.exports = {
    save_edits,
    revert,
    mark_unreadable
}