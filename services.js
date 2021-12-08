var connect = require('./connection')
const fetchUser = (value) => {
    const query = `select * from users where id=? and manager = 'y';`
      let data = [value];
    connect.connectDB() 
    .then((conn)=>{
      conn.query(query, data, (err, results)=>{
        conn.end()
        if(err){
        }
        console.log("results:", results)
      })
    })
    .catch((connectErr)=>{
      console.log("Error", connectErr)
    })
  }

// const getUser = (value)=>{
//     let query = `select * from users`
//   let data = [value];
//   connect.connectDB() 
//   .then((conn)=>{
//     conn.query(query, data, (err, results)=>{
//       conn.end()
//       if(err){
//         console.log("Error:",err)
//         return res.json({status:-1, message:"Error"})
//       }
//       console.log("results:", results)
//       res.json({status:1,results})
//     })
//   })
//   .catch((connectErr)=>{
//     console.log("Error", connectErr)
//   })
// }
module.exports = fetchUser
//module.exports = getUser