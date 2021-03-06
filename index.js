var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
      io.emit('newplayer',1);
      io.emit('allplayers', players);
    }
    else if(players[1]==0) {
      console.log('p2 joined the game');
      players[1]=1;
      psocks[1]= socket.id; 
      io.to(socket.id).emit('register' , 2);
      io.emit('newplayer',2);
      io.emit('allplayers', players);
    }
    else if(players[2]==0) {
      console.log('p3 joined the game');
     players[2]=1;
      psocks[2]= socket.id; 
      io.to(socket.id).emit('register' , 3);
      io.emit('newplayer',3);
      io.emit('allplayers', players);
    }
    else if(players[3]==0) {
      console.log('p4 joined the game');
      players[3]=1;
      psocks[3]= socket.id; 
      io.to(socket.id).emit('register' , 4);
      io.emit('newplayer',4);
      io.emit('allplayers', players);
    }
  });

  socket.on('movement', function(data){
  	io.emit('movement', data);
  });

  socket.on('lazer', function(data){
    io.emit('lazerAdd', data);
  });

  socket.on('kill', function(data) {
    //data should contain two fields pkld, and pklr
    console.log('player ' + data.pklr + ' killed ' + data.pkld);
    var pkilled = data.pkld-1; 
    players[pkilled]=0; 
    io.emit('kill', data);
  });

  socket.on('disconnect', function(){
    if(psocks[0]==socket.id) {
      players[0]=0; 
      console.log('p1 left the game');
      io.emit('kill', {pkld: 1, pklr: -1});
      psocks[0]=null;
    } else if (psocks[1]==socket.id) {
      players[1]=0; 
      console.log('p2 left the game');
      io.emit('kill', {pkld: 2, pklr: -1});
      psocks[1]=null;
    } else if (psocks[2]==socket.id) {
      players[2]=0; 
      console.log('p3 left the game');
      io.emit('kill', {pkld: 3, pklr: -1});
      psocks[2]=null;
    } else if (psocks[3]==socket.id) {
      players[3]=0; 
      console.log('p4 left the game');
      io.emit('kill', {pkld: 4, pklr: -1});
      psocks[3]=null;
    }
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
