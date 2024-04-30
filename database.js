const mariadb = require('mariadb');
const fs = require('fs');
const { dirname } = require('path');

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

async function updateObject(id, nom, local, localisation){
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`UPDATE objets SET nom = '${nom}', local = '${local}', localisation = '${localisation}' WHERE objet = ${id}`);
        return res
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function addVideo(nom, taille, md5, dirnom, objet){
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`SELECT ordre FROM video_objets ORDER BY ordre DESC`);
        console.log(res)
        let nextOrder = 0
        if(res[0]){
            nextOrder = res[0].ordre + 1
        }
        const realRes = await conn.query(`INSERT INTO video_objets (nom, taille, md5, ordre, dirnom, objet) VALUES ('${nom}', ${taille}, '${md5}', ${nextOrder}, '${dirnom}', ${objet})`)
        return realRes
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

async function getVideos(id){
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`SELECT * FROM video_objets WHERE objet = ${id} ORDER BY ordre`);
        return res
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

async function deleteVideo(id){
    let conn;
    try {
        conn = await pool.getConnection();
        const selectRes = await conn.query(`SELECT * FROM video_objets WHERE video = ${id}`);
        const dirname = selectRes[0].dirnom
        fs.unlink("/home/admis/6GP-Backend/videos/" + dirname, (err) => {
            console.log(err)
        })
        const res = await conn.query(`DELETE FROM video_objets WHERE video = ${id}`);
        return res
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

async function updateVideo(id, nom, ordre){
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`UPDATE video_objets SET nom = '${nom}', ordre = ${ordre} WHERE video = ${id}`);
        return res
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

async function addVideoInfo(date, video, objet, nb, jouer){
    let conn;
    try {
        conn = await pool.getConnection();
        const infos = await conn.query(`SELECT * FROM videos_par_jour WHERE date_jour = '${date}' AND id_video = ${video} AND id_objet = ${objet};`);
        const res = infos
        let exist = false
        res.forEach((element) => {
            exist = true
        });
        if(exist){
            const resDB = await conn.query(`UPDATE videos_par_jour SET nb_jouer = ${nb}, temps_jouer = ${jouer} WHERE date_jour = '${date}' AND id_video = ${video} AND id_objet = ${objet};`);
            return resDB
        }
        else{
            const resDB = await conn.query(`INSERT INTO videos_par_jour (date_jour, id_video, id_objet, nb_jouer, temps_jouer) VALUES ('${date}', ${video}, ${objet}, ${nb}, ${jouer})`);
            return resDB
        }
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

async function getVideoInfo(idObjet){
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`SELECT * FROM videos_par_jour WHERE date_jour = DATE_FORMAT(date_jour, '%Y-%m-%d') AND id_objet = ${idObjet};`);
        return res
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

module.exports = {
    testDatabase,
    getAllObjects,
    updateObject,
    addVideo,
    getVideos,
    deleteVideo,
    updateVideo,
    addVideoInfo,
    getVideoInfo

}
