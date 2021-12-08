const jwt = require('jsonwebtoken')
const secretKey = "Hanish"
const generateToken = function(user){
    const token = jwt.sign({user}, secretKey, {expiresIn : 30000})
    console.log("Token is:",token)
    return token
}

const verifyToken = function(token){
    return new Promise((resolve, reject)=>{
        jwt.verify(token, secretKey, (err, res) =>{
            if(err){
                console.log("Token verification failed:",err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}



// const verifyToken = function(token){
//     try{
//     var decoded = jwt.verify(token, 'qw');
//     }
//     catch(err){
//         console.log(err)
//     }
//     return new Promise((resolve, reject)=>{
//     jwt.verify(token, 'qw', (err, decoded) =>{
//                     if(err){
//                         console.log("Token verification failed:",err)
//                         reject(err)
//                     }
//                     else{
//                         console.log("verified authentication",decoded.user)
//                         resolve(decoded)
//                     }
//                 })
// })
// }


module.exports = {generateToken, verifyToken}