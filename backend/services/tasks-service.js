require('dotenv').config();

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


module.exports = {
    get_all_tasks,
    get_max_page
}