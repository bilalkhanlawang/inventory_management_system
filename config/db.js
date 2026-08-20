const mysql = require ("mysql2/promise");
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
});

// connection of database 
async function testDB(){
    try{
        const connection = await pool.getConnection();
        console.log("connection is successful");
        connection.release();
        return true;
    }catch(error){
        console.log(error.message);
        return false;
    }
}

module.exports = {
    pool,
    testDB
};