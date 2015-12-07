var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var p1 = 0; 
var p1sock; 
var p2 = 0; 
var p2sock; 
var p3 = 0; 
var p3sock; 
var p4 = 0; 
var p4sock; 

app.use("/js",express.static(__dirname + "/js"));
app.use("/css",express.static(__dirname + "/css"));
app.use("/images",express.static(__dirname + "/images"));

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
 // socket.on('chat message', function(msg){
  //  io.emit('chat message', msg);
  //});
  socket.on('register', function(){
  	if(p1==0) {
  		p1=1;
  		p1sock= socket.id; 
  		io.to(p1sock).emit('register' , 1);
  	}
  	else if(p2==0) {
  		p2=1;
  		p2sock= socket.id; 
  		io.to(p2sock).emit('register' , 2);
  	}
  	else if(p3==0) {
  		p3=1;
		p3sock= socket.id; 
  		io.to(p3sock).emit('register' , 3);
  	}
  	else if(p4==0) {
  		p4=1;
		p4sock= socket.id; 
  		io.to(p4sock).emit('register' , 4);
  	}
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});