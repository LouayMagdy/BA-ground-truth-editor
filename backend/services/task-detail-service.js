require('dotenv').config();
let utils = require('./utils')
const e = require("express");

let get_task_text_readable = async (connection, filename) =>{
    /***
     attributes:
     * connection: db_connection promise
     * filename: (string) name of file attached to the task ----> unique for each task
     Logic:
     * each File has a maximum of 2 edit records in the DB.
     * So, this method returns the edit_text and readable records of the last edit.
     ***/
    try{
        return (await connection.query(`SELECT edit_text, readable
                                        FROM   EDIT E JOIN FILE F ON E.file_id = F.id 
                                        WHERE  F.filename = "${filename}" AND E.edited_at = (
                                            SELECT MAX(edited_at)
                                            FROM  EDIT
                                            WHERE E.file_id = EDIT.file_id)`
                                       ))[0]
    }
    catch (err){
        console.log(err)
        return ''
    }
}

let get_task_history = async (connection, filename) => {
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
    let file_id = await utils.filename_to_id(connection, filename)
    let modifier = (await connection.query(`SELECT username as 'modified', mini.edited_at as 'modified_at'
                                            FROM   EDIT JOIN USER ON user_id = USER.id
                                                   NATURAL JOIN (
                                                        SELECT MIN(edited_at) as 'edited_at', file_id
                                                        FROM   EDIT
                                                        WHERE  file_id = ${file_id}
                                                   ) AS mini `))[0]
    let reviewer = (await connection.query(`SELECT username as 'revised', maxi.edited_at as 'revised_at'
                                            FROM   EDIT JOIN USER ON user_id = USER.id
                                                   NATURAL JOIN (
                                                        SELECT MAX(edited_at) as 'edited_at', file_id
                                                        FROM   EDIT
                                                        WHERE  file_id = ${file_id}
                                                   ) AS maxi`))[0]
    try{
        if (String(reviewer.revised) === String(modifier.modified)) {
            reviewer.revised_at = ''
            reviewer.revised = ''
        }
    }catch (err){
        console.log(err)
        reviewer = {revised: '', revised_at: ''}
    }
    try{
        if(!modifier.modified) {
            modifier.modified_at = ''
            modifier.modified = ''
        }
    }catch (err){
        console.log(err)
        modifier = {modified: '', modified_at: ''}
    }
    return {...modifier, ...reviewer}
}

let get_task_number = async (connection, filename) => {
    /***
     attributes:
     * connection: db_connection promise
     * filename: (string) name of file attached to the task ----> unique for each task
     returns:
     * file index in the DB
     * total number of files in the system
     ***/
    let numbers =  (await connection.query(`SELECT *
                                    FROM (
                                        SELECT id as 'current'
                                        FROM   FILE
                                        where filename = "${filename}"
                                    ) AS ID, (
                                        SELECT COUNT(id) as 'max'
                                        FROM   FILE
                                    ) AS MAX
    `))[0]
    try{ numbers.current = Number(numbers.current) }
    catch (err) {
        console.log(err)
        numbers = {current: 0}
    }
    try{ numbers['max'] = Number(numbers['max']) }
    catch (err) {
        console.log(err)
        numbers = {max: 0}
    }
    return numbers
}

let get_task_page = async (connection, filename) => {
    let file_id = await (utils.filename_to_id(connection, filename))
    return Math.ceil(file_id / process.env.page_size) - 1
}


module.exports = {
    get_task_text_readable,
    get_task_history,
    get_task_number,
    get_task_page
}