const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
var fs = require('fs');
var upload = multer({ storage: storage })

//CREATE EXPRESS APP
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })   
 
  // ROUTES
  app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');   
  });

  app.get('/photos', (req, res) => {
      db.collection('quotes').find().toArray((err, result) => {  
        const imgArray= result.map(element => element._id);
        console.log(imgArray);  
    if (err) return console.log(err)
    res.send(imgArray)
  
    })
})

  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database     
    var finalImg = {
         contentType: req.file.mimetype,
         image:  new Buffer(encode_image, 'base64')
      };
     
   db.collection('quotes').insertOne(finalImg, (err, result) => {
       console.log(result)    
       if (err) return console.log(err)    
       console.log('saved to database')
       res.redirect('/')
     })    
  })
//ROUTES WILL GO HERE
// app.get('/', function(req, res) {
//     res.json({ message: 'WELCOME' });   
// });


const MongoClient = require('mongodb').MongoClient
const myurl = 'mongodb://localhost:27017';
 
MongoClient.connect(myurl, (err, client) => {
  if (err) return console.log(err)
  db = client.db('test') 
  app.listen(3004, () => {
    console.log('listening on 3004')
  })
})
 
// app.listen(3002, () => console.log('Server started on port 3002'));