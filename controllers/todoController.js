var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database 
const dbURI = 'mongodb://r_c:system@note-app-shard-00-00.dt1of.mongodb.net:27017,note-app-shard-00-01.dt1of.mongodb.net:27017,note-app-shard-00-02.dt1of.mongodb.net:27017/Noteit?ssl=true&replicaSet=atlas-11jim1-shard-0&authSource=admin&retryWrites=true&w=majority'//'mongodb://r_c:system@node-app-shard-00-00.dt1of.mongodb.net:27017,node-app-shard-00-01.dt1of.mongodb.net:27017,node-app-shard-00-02.dt1of.mongodb.net:27017/Noteit?ssl=true&replicaSet=atlas-uavwx0-shard-0&authSource=admin&retryWrites=true&w=majority';//'mongodb+srv://r_c:system@node-app.dt1of.mongodb.net/Noteit?retryWrites=true&w=majority';
mongoose.connect(dbURI,{useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true })
.then((result)=> console.log('connnected to db'))
.catch((err)=> console.log(err));

//Create a schema
var todoSchema = new mongoose.Schema({
     item: String
});

mongoose.connection.on('connected',()=>{
  console.log('Mongoose connected');
});

var Todo = mongoose.model('Todo', todoSchema); //2nd Todo is model name which will be stored as a collection in mongodb
/*   
  var itemOne = Todo({item: 'Assignment'}).save(function(err){ //itemOne is of type Todo 
  if(err) throw err;
  console.log('item saved');
  });
*/

// var data = [{item:'Coding..'},{item:'Assignment..'}]; //dummy data on the server
var urlencodedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app){
//going to set up all our event handlers,set up routes

//render a view when we get a request for /todo
 app.get('/todo',function(req,res){
    // get data from mongodb and pass it to view
    Todo.find({},function(err,data){//to go the collection 'Todo' to find the items 
         if(err) throw err;
         res.render('todo',{todos: data});
    });
    
 });

 //handler for post request,fired when ajax post request is made.
 //add body-Parser,so that we can access the data that are sent to us on the post request
 app.post('/todo', urlencodedParser, function(req,res){
   //get data from the view and add it to mongodb
   var newTodo = Todo(req.body).save(function(err,data){
      if(err) throw err;
      res.render('todo', {todos: data});
   })
   ////data.push(JSON.parse(JSON.stringify(req.body))); //get the data from the request body and push that data object into an array
    
 });

 //handler for delete request
 app.delete('/todo/:item',function(req,res){
   //delete the requested item from mongodb 
   Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
      if(err) throw err;
      res.json({todos: data});
   });
   /*
   var item = req.params.item;
   data = data.filter(function(todo){
     return todo.item.replace(/ /g,'-') !== item;
   });
   res.json({todos: data});
   */

 });
 
};