const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    connectionLimit: 5,
    database: "videoDB"
});

async function testDatabase(){
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1 as val");
        console.log(rows); //[ {val: 1}, meta: ... ]
        return rows
        //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getAllObjects(){
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM objets");
        return rows
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = {
    testDatabase,
    getAllObjects,

}
