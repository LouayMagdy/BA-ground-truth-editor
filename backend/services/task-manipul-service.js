require('dotenv').config();
const utils = require('./utils')

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
    let message = await connection.query(`Insert INTO EDIT(edited_at, edit_text, user_id, file_id)
                                          VALUE(CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Africa/Cairo'), 
                                                "${edit.edit_text}", ${user_id}, ${file_id})`)
    return !!message.affectedRows
}

let revert = async (connection, filename) => {
    /***
    attribute:
     * connection: DB connection promise
     * filename: (String) associated with each task
    returns
     * last EDIT Table record for this filename
    ***/
    let file_id = await utils.filename_to_id(connection, filename)
    return (await connection.query(`SELECT   filename, username AS 'modified', edit_text, edited_at, readable
                                    FROM     EDIT E JOIN FILE F ON E.file_id = F.id
                                             JOIN USER U ON E.user_id = U.id
                                    WHERE    file_id = ${file_id}
                                    ORDER BY edited_at DESC
                                    LIMIT 1`))[0]
}

let mark_unread_edit = async (connection, edit) => {
    /***
    attributes:
     * connection: DB Connection
     * edit: EDIT Object
    Logic:
     * marks the file as unreadable for the first time (there is no previous edit)
    ***/
    let file_id = await utils.filename_to_id(connection, edit.filename)
    let user_id = await utils.username_to_id(connection, edit.modified)
    let message = (await connection.query(`UPDATE  EDIT
                                           SET     readable = False,
                                                   edited_at = CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Africa/Cairo'),
                                                   user_id = ${user_id}
                                           WHERE   file_id = ${file_id}`))
    return !! message.affectedRows
}

let mark_unread_revise = async (connection, edit) => {
    /***
     attributes:
     * connection: DB Connection
     * edit: EDIT Object
     Logic:
     * marks the file as unreadable for the second time (there is some previous edit)
     ***/
    let file_id = await utils.filename_to_id(connection, edit.filename)
    console.log(edit.filename, file_id)
    let user_id = await utils.username_to_id(connection, edit.modified)
    let message = (await connection.query(`Insert INTO EDIT(edited_at, readable, user_id, file_id)
                                          VALUE(CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Africa/Cairo'), 
                                                FALSE, ${user_id}, ${file_id})`))
    return !! message.affectedRows
}

module.exports = {
    save_changes,
    revise_changes,
    revert,
    mark_unread_edit,
    mark_unread_revise
}