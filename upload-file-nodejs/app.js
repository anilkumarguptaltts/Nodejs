// const express = require('express')
// const app = express()
// const port = 3000
// var fs = require('fs');

// function listPrimes( nPrimes ) {
//     var primes = [];
//     for( var n = 2;  nPrimes > 0;  n++ ) {
//         if( isPrime(n) ) {
//             primes.push( n );
//             --nPrimes;
//         }
//     }
//     return primes;
// }

// function isPrime( n ) {
//     var max = Math.sqrt(n);
//     for( var i = 2;  i <= max;  i++ ) {
//         if( n % i === 0 )
//             return false;
//     }
//     return true;
// }

// app.get('/list', (req, res) => {    
//     const numb =  listPrimes(100).map(item => {
//             return item;
//     });
//     res.send(numb +'/n');  
// })
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

var express = require('express');
const path = require('path');
var app = express();
var PORT = 3001;
const multer  = require('multer');
//with middleware

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

app.use('/', function(req, res, next){
	res.status(200).send("Status Working");
  next();
});

app.get('/', function(req, res){
	console.log("Home Page!")
	res.send();
});


app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
