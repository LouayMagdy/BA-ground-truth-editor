require('dotenv').config();

let get_all_tasks = async (connection, min_id, max_id) => {
    let tasks = await connection.query(`
                                        SELECT FILE.filename, EUSER.username AS 'modified', RESULT.modified_at, 
                                               RESULT.readable, RUSER.username AS 'revised', RESULT.revised_at
                                        FROM
                                            (SELECT REVISION.file_id, EDITION.user_id AS 'modified', REVISION.readable, 
                                                    CONVERT_TZ(EDITION.edited_at, 'UTC', 'Africa/Cairo') AS 'modified_at', 
                                                CASE
                                                    WHEN REVISION.edited_at = EDITION.edited_at THEN NULL
                                                    ELSE REVISION.user_id
                                                END AS 'revised',
                                                CASE
                                                    WHEN REVISION.edited_at = EDITION.edited_at THEN NULL
                                                    ELSE CONVERT_TZ(REVISION.edited_at, 'UTC', 'Africa/Cairo')
                                                END AS 'revised_at'
                                            FROM ( SELECT E.file_id, E.user_id, E.edited_at, E.readable
                                                   FROM EDIT E NATURAL JOIN (
                                                        SELECT   file_id, MAX(edited_at) AS 'edited_at'
                                                        FROM     EDIT
                                                        WHERE    file_id > ${min_id} AND file_id <= ${max_id}
                                                        GROUP BY file_id) AS E_MAX                                                     
                                                 ) AS REVISION JOIN (
                                                   SELECT E.file_id, E.user_id, E.edited_at, E.readable
                                                   FROM EDIT E NATURAL JOIN (
                                                        SELECT   file_id, MIN(edited_at) AS 'edited_at'
                                                        FROM     EDIT
                                                        WHERE    file_id > ${min_id} AND file_id <= ${max_id}
                                                        GROUP BY file_id) AS E_MIN 
                                                 ) AS EDITION 
                                                 ON REVISION.file_id = EDITION.file_id
                                            ) AS RESULT 
                                            LEFT JOIN USER EUSER ON RESULT.modified = EUSER.id
                                            LEFT JOIN USER RUSER ON RESULT.revised = RUSER.id
                                            JOIN FILE ON RESULT.file_id = FILE.id
                                            ORDER BY RESULT.file_id
                                        `)
    return tasks
}

let get_max_page = async (connection) => {
    let res = await connection.query("SELECT COUNT(DISTINCT file_id) AS 'COUNT' FROM EDIT")
    return Math.ceil(Number(String(res[0].COUNT)) / process.env.page_size) - 1
}


module.exports = {
    get_all_tasks,
    get_max_page
}