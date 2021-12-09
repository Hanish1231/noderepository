const { application } = require('express')
var connect = require('./connection')
const {validationResult } = require('express-validator')
const {generateToken, verifyToken} = require('./authentication')
const express = require('express');
const app = express();
app.use(express.json())
const path = require('path');
var getUser = require('./services')

const multer = require('multer')
const storage = multer.diskStorage({
     destination: (req, file, cb) =>{
         cb(null, './newImages')
     },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
    }) 

const uploads = multer({storage: storage});
app.use((req, res, next)=>{
  const token = req.headers.token
  console.log("Token:", token)
  if(token){
    verifyToken(token).then((res)=>{
      console.log("Token is verified:", token)
      return next()
    })
    .catch((err)=>{
      console.log("Error", err)
      console.log("pull")
      res.status(403).json(err)
      if(err.name=== "JsonWebTokenError"){
        console.log("Please check token")
      }
    })
  }
  else{
return next()
}
})
const rules = require('./validations')
app.get("/upload", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
});
app.post('/samplepost', (req, res)=>{
  res.send("Sample post")
})
app.post('/profile', uploads.single('single'), (req, res)=>{
    console.log(req.file);
    res.send("File uploaded")
}); 

app.post('/profilemulti', uploads.array('multi', 3), (req, res)=>{
    console.log(req.file);
    res.json("Files uploaded")
});

app.get('/team/:bId', ...rules.getRules, (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors:", errors)
      return res.status(400).json({ errors: errors.array() });
    }
    let query = `select * from users where bId=?;`
    let data = [req.params.bId];
    connect.connectDB() 
    .then((conn)=>{
      conn.query(query, data, (err, results)=>{
        conn.end()
        if(err){
          console.log("Error:",err)
          return res.json({status:-1, message:"Error"})
        }
        console.log("results:", results)
        res.json({status:1,results})
      })
    })
    .catch((connectErr)=>{
      console.log("Error", connectErr)
    })
  })

app.get('/:id', ...rules.getRules, async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors:", errors)
    return res.status(400).json({ errors: errors.array() });
  }
  let value = [req.params.id];
   await getUser(value)
   .then((results)=>{
     res.json(results)
   })
   .catch((err)=>{
    res.json("Err");
   })
return true
})

app.post("/createUser", [...rules.createRules], (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors:", errors)
      return res.status(400).json({ errors: errors.array() });
    }
  console.log("req.body",req.body)
  
  let query = `INSERT INTO users (id, uName, city, pincode, manager, mId, bId) values (?,?,?,?,?,?,?);`
  let data = [req.body.id, req.body.uName, req.body.city, req.body.pincode, req.body.manager, req.body.mId, req.body.bId];
  connect.connectDB() 
  .then((conn)=>{
    conn.query(query, data, (err, results)=>{
      conn.end()
      if(err){
        console.log("Error:",err)
        return res.json({status:-1, message:"Error"})
      }
      console.log("results:", results)
      res.json({status:1,results})
    })
  })
  .catch((connectErr)=>{
    console.log("Error", connectErr)
  })
})

app.put("/updateUser/:id", [...rules.updateRules], (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors:", errors)
      return res.status(400).json({ errors: errors.array() });
    } 
    let columns = ""
    if(req.body.uName) {
        columns+="uName = ? ,"
      }
    if(req.body.city) {
      columns+= " city = ? ,"
    }
    if(req.body.pincode) {
      columns+=" pincode = ? "
    }

    let query = `update users set ${columns} where id=?;` 

    let data = [req.body.uName, req.body.city, req.body.pincode, req.params.id];
    connect.connectDB() 
    .then((conn)=>{
      conn.query(query, data, (err, results)=>{
        conn.end()
        if(err){
          console.log("Error:",err)
          return res.json({status:-1, message:"Error"})
        }
        console.log("results:", results)
        res.json({status:1,results})
      })
    })
    .catch((connectErr)=>{
      console.log("Error", connectErr)
    })
  })


  app.post('/login', (req,res)=>{
    const token = generateToken(req.body.user)
    res.json({status : 1, token})
  })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});