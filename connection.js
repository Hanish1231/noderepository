const mysql = require('mysql');
const pool = mysql.createPool({
    user : 'sql6457569',
    password : 'swpzgfW1y5',
    host : 'sql6.freemysqlhosting.net',
    database : 'sql6457569',
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