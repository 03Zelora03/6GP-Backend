const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    connectionLimit: 5
});

async function testDatabase(){
    pool.getConnection()
    .then(conn => {
        conn.query("SELECT 1 as val")
        .then((rows) => {
            console.log("hello")
            return rows
        })
    })
    return null
}

module.exports = {
    testDatabase,
}
