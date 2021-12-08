const {body, param } = require('express-validator')
var connect = require('./connection')
var fetchUser = require('./services')
const validator1 = body('id').isNumeric()
.withMessage("Provide a proper Number")

const validator2 = body('uName').isLength(5, 10)
.withMessage("Name should be min 5 and max of 10 characters")

const validator3 = body('pincode').isLength(6)
.withMessage("Pincode should be 6 digits")

 
const testValidator = param('id').custom((value, next) => {
    (async()=>{
      let dbresult = await fetchUser(value)
       if(!dbresult) {
        throw new Error("Invalid user")
    }
    })
    return true 

})



module.exports.createRules  = [ validator1, validator2, validator3]
module.exports.updateRules  = [validator2, validator3]
module.exports.getRules  = [testValidator]