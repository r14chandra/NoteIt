//app.js - entry point for our app

var express = require('express');
var todoController = require('./controllers/todoController'); //module.exports enters function in here
var app = express();

//set up template engine
app.set('view engine','ejs');

//serving static files using inbuilt express middleware(express.static)
//Not route specific.The middleware is going to be used on every route that we put into the url bar 
app.use(express.static('./public'));

// fire controllers
todoController(app); //app is available to the todoController.js 

//listen to port 
app.listen(3000);
console.log('listening to port 3000');