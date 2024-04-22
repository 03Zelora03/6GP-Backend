const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    connectionLimit: 5
});

function testDatabase(){
    pool.getConnection()
    .then(conn => {
        conn.query("SELECT 1 as val")
        .then((rows) => {
            return rows
        })
    })
    return null
}

module.exports = {
    testDatabase,
}
