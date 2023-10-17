require('dotenv').config();

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


module.exports = {
    get_task_text,
    get_task_mod_date,
}