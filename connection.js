const mysql = require('mysql');
const pool = mysql.createPool({
    user : 'root',
    password : 'Hanish123',
    host : 'localhost',
    database : 'nodedb',
    // port : 3306,
    // max : 10,
});

let connectDB = ()=>{
    return new Promise((resolve, reject) =>{
        pool.getConnection(function (err, conn){
            if(err) {
                console.log("Error",err);
                reject(err);
            }
            else{
                // console.log("connected", conn)
                resolve(conn);
            }
        })
    })
}

module.exports.connectDB = connectDB;