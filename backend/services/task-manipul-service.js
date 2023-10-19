require('dotenv').config();
const utils = require('./utils')
const url = require("url");

let save_changes = async (connection, edit) => {
    /***
    attributes:
     * connection: DB connection promise
     * edit: EDIT Object containing necessary data about the edit.
    returns:
     * a message of is there any rows affected after updating an EDIT Records.
     * this would be used in the Frontend to inform the user if his changes was saved or not.
    ***/
    let user_id = await (utils.username_to_id(connection, edit.modified))
    let file_id = await (utils.filename_to_id(connection, edit.filename))
    let message = await connection.query(`UPDATE EDIT
                                          SET    edited_at = CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Africa/Cairo'), 
                                                 edit_text = "${edit.edit_text}",
                                                 readable = ${edit.readable},
                                                 user_id  = ${user_id} 
                                          WHERE  file_id = ${file_id}`)
    return !!message.affectedRows
}

let revise_changes = async (connection, edit) => {
    /***
    attributes:
     * connection: DB connection promise
     * edit: EDIT Object containing necessary data about the edit.
    returns:
     * a message of is there any rows affected after updating an EDIT Records.
     * this would be used in the Frontend to inform the user if his changes was saved or not.
    ***/
    let user_id = await (utils.username_to_id(connection, edit.modified))
    let file_id = await (utils.filename_to_id(connection, edit.filename))

    let message = await connection.query(`Insert INTO EDIT(edited_at, edit_text, user_id, file_id, readable)
                                          VALUE(CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Africa/Cairo'), 
                                          "${edit.edit_text}", ${user_id}, ${file_id}, ${edit.readable})`)
    return !!message.affectedRows
}

let change_task = async (connection, direction, filename) => {
    let file_id = await (utils.filename_to_id(connection, filename))
    console.log("id", file_id)
    file_id = direction === 'prev'? --file_id : ++file_id;
    console.log("changed id", file_id)
    return await (utils.file_id_to_filename(connection, file_id))
}

module.exports = {
    save_changes,
    revise_changes,
    change_task
}