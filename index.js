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
var players = [0,0,0,0];
var psocks = new Array(4);

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
  	
    if(players[0]==0) {
      console.log('p1 joined the game');
      players[0]=1;
      psocks[0]= socket.id; 
      io.to(socket.id).emit('register' , 1);
    }
    else if(players[1]==0) {
      console.log('p2 joined the game');
      players[1]=1;
      psocks[1]= socket.id; 
      io.to(socket.id).emit('register' , 2);
    }
    else if(players[2]==0) {
      console.log('p3 joined the game');
     players[2]=1;
      psocks[2]= socket.id; 
      io.to(socket.id).emit('register' , 3);
    }
    else if(players[3]==0) {
      console.log('p4 joined the game');
      players[3]=1;
      psocks[3]= socket.id; 
      io.to(socket.id).emit('register' , 4);
    }
  });

  socket.on('movement', function(data){
  	io.emit('movement', data);
  });

  socket.on('kill', function(data) {
    //data should contain two fields pkld, and pklr
    var pkilled = data.pkld-1; 
    players[pkilled]=0; 
    io.emit('kill', data);
  });

  socket.on('disconnect', function(){
    if(psocks[0]==socket.id) {
      players[0]=0; 
      console.log('p1 left the game');
    } else if (psocks[1]==socket.id) {
      players[0]=1; 
      console.log('p2 left the game');
    } else if (psocks[2]==socket.id) {
      players[0]=2; 
      console.log('p3 left the game');
    } else if (psocks[3]==socket.id) {
      players[0]=3; 
      console.log('p4 left the game');
    }
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});