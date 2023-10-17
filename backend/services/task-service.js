require('dotenv').config();
const utils = require('./utils')

let get_all_tasks = async (connection, to_skip) => {
    let tasks = await connection.query(`SELECT USER.username, FILE.filename, EDIT.readable 
                                   FROM EDIT JOIN FILE ON EDIT.file_id = FILE.id
                                   JOIN USER ON EDIT.user_id = USER.id
                                   ORDER BY edited_at
                                   LIMIT ${process.env.page_size} OFFSET ${to_skip}`)
    console.log(tasks)
    return tasks
}

let get_max_page = async (connection) => {
    let res = await connection.query("SELECT COUNT(*) AS 'COUNT' FROM EDIT")
    return Number(String(res[0].COUNT)) / process.env.page_size
}

/*** Task Details Requests ***/

let get_task_text = async (connection, filename) =>{
    /***
    attributes:
     * connection: db_connection promise
     * filename: (string) name of file attached to the task ----> unique for each task
    Logic:
     * each File has a maximum of 2 edit records in the DB.
     * So, this method returns the text of the last edit.
    ***/
    try{
        return (await connection.query(`SELECT edit_text
                                        FROM   EDIT E JOIN FILE F ON E.file_id = F.id 
                                        WHERE  F.filename = "${filename}" AND E.edited_at = (
                                            SELECT MAX(edited_at)
                                            FROM  EDIT
                                            WHERE E.file_id = EDIT.file_id)`
                                        ))[0].edit_text
    }
    catch (err){return ''}
}

let get_task_mod_date = async (connection, filename) => {
    /***
    attributes:
     * connection: db_connection promise
     * filename: (string) name of file attached to the task ----> unique for each task
    Logic:
     * Each File has a maximum of 2 edit records in the DB.
     * So, this method gets the dates of these max and min edit.
     * if max == min --> the task has just been added (no edits yet) or may be the task is only modified (not revised).
     * otherwise --> the task is modified and revised
    ***/
    let dates = (await connection.query(`SELECT MIN(edited_at) AS 'modified_at', MAX(edited_at) AS 'revised_at'
                                         FROM   EDIT E JOIN FILE F ON E.file_id = F.id
                                         WHERE  F.filename = "${filename}"`))[0]
    if(String(dates.modified_at) === String(dates.revised_at)) dates.revised_at = ''
    return dates
}

/*** Task Editing Requests ***/

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
                                          SET    edited_at = CURRENT_TIMESTAMP, 
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
                                          VALUE(CURRENT_TIMESTAMP, "${edit.edit_text}", ${user_id}, ${file_id})`)
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
                                                   edited_at = CURRENT_TIMESTAMP,
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
                                          VALUE(CURRENT_TIMESTAMP, FALSE, ${user_id}, ${file_id})`))
    return !! message.affectedRows
}

module.exports = {
    get_all_tasks,
    get_max_page,
    get_task_text,
    get_task_mod_date,
    save_changes,
    revise_changes,
    revert,
    mark_unread_edit,
    mark_unread_revise
}