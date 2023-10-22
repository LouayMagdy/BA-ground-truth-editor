const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const db = require('./db_config');

db.getConnection().then(connection => {
    async function readCSV() {
        const stream = fs.createReadStream('./data-to-import/users.csv').pipe(csv());
        for await (const record of stream) {
            let hashed_pass = await bcrypt.hash(record.password, 10)
            await connection.query(`INSERT INTO USER(name, email, username, password)
                                        VALUES("${record.name}", "${record.email}", "${record.username}", "${hashed_pass}")`)
        }
    }
    readCSV().then(() => {
        connection.release().then(() => {})
        connection.end().then(() => process.exit())
    })
});
