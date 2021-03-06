//var canvasboard = document.getElementById('gameboard');
//var ctxboard = gameboard.getContext("2d");


var canvas = document.getElementById('game');
var ctx = game.getContext("2d");
var pColor = 'black'
var p1 = new Player(75,75, 0, 45, '#FF0000');
var p2 = new Player(3925,3925, 0, -45, '#00FF00');
var p3 = new Player(3925,75, -45, 0, '#0000FF');
var p4 = new Player(75,3925, 45, 0, '#FFFF00');
var players = [];
players.push(p1);
players.push(p2);
players.push(p3);
players.push(p4);
var lazers = [];

var SCREENWIDTH = window.innerWidth;
var SCREENHEIGHT = window.innerHeight;

var initWidth=(window.innerWidth)/2;
var initHeight=window.innerHeight/2;

console.log(players[0].x);

var pnum;
//added
var socket = io();
// end added

var mouseMove;
var mousePos;
var collision = 0;
var lazerHit = 0;

var currentCanvas;
var img = new Image();

var spaceControl = [];

img.onload = function() {
  ctx.drawImage(img, 0, 0, 4000, 4000);
  initSpace();
  createPlayer(p1);
  createPlayer(p2);
  createPlayer(p3);
  createPlayer(p4);
};

img.src = "/images/gameboard.jpg";

socket.on('lazerAdd', function(data) {
  if(data.lazer.playerNum != pnum)
    lazers.push(data.lazer)
});

socket.on('newplayer', function(data) {
 //  var ndata = data-1;
   switch (data) {
      case 1:
        players[data-1] = p1;
        break;
      case 2: 
        players[data-1] = p2;
        break;
      case 3: 
        players[data-1] = p3;
        break;
      case 4: 
        players[data-1] = p4;
        break;

    }
});

socket.on('kill', function(data) {
  //if data.pkld is self, end game
  if(data.pkld == pnum){
    clearInterval(currentCanvas);
    eliminated(players[pnum-1].x, players[pnum-1].y);
  }else{
      players[data.pkld-1] = null;
  }
  // else remove which ever player it is. 
});

function eliminated(x,y){
  ctx.font = "40px BankFuturistic";
  ctx.fillStyle = '#FF8000';
  ctx.fillText("Eliminated" ,x-100, y - 20);
  ctx.font = "40px BankFuturistic";
  ctx.fillStyle = '#FF8000';
  ctx.fillText("Refresh To Continue The Fight!",x -270, y + 40);
}

function initSpace(){
  var imgd = ctx.getImageData(0, 0, 4000, 4000);
  var pix = imgd.data;
  console.log(pix.length);
  for (var i = 0; n = (pix.length), i < n; i += 4) {
    
    if (pix[i] == 0 || pix[i] == 1) {
    
      spaceControl[i/4] = true;
    }else{
      spaceControl[i/4] = false;
    }
  }

}

socket.on('movement', function(data) {

    if(data.pid != pnum){

    switch (data.pid) {
      case 1:
        p1.x=data.x;
        p1.y=data.y;
        p1.sx=data.sx;
        p1.sy=data.sy;
        break;
      case 2: 
        p2.x=data.x;
        p2.y=data.y;
        p2.sx=data.sx;
        p2.sy=data.sy;
        break;
      case 3: 
        p3.x=data.x;
        p3.y=data.y;
        p3.sx=data.sx;
        p3.sy=data.sy;
        break;
      case 4: 
        p4.x=data.x;
        p4.y=data.y;
        p4.sx=data.sx;
        p4.sy=data.sy;
        break;

    }
  }

  });
function playGame(){
  var p; 

  socket.emit('register', 1);
  socket.on('register' , function(num){
  pnum=num;
  console.log(num);
  switch (num) {
    case 1:
      p = p1; 
      break; 
    case 2: 
      p = p2; 
      break; 
    case 3:
      p = p3;
      break; 
    default: 
      p = p4; 
    }
});

  socket.on('allplayers', function(players){
    if(players[0]==1) {
        $("#redp").removeClass("fa-circle-thin").addClass("fa-circle");

      }if (players[1]==1) {
        $("#greenp").removeClass("fa-circle-thin").addClass("fa-circle");
      } if (players[2]==1) {
        $("#bluep").removeClass("fa-circle-thin").addClass("fa-circle");
      } if (players[3]==1) {
        $("#yellowp").removeClass("fa-circle-thin").addClass("fa-circle");
      }
  });
  
  canvas.addEventListener('mousemove', function(event){
    mousePos = getMousePos(canvas, event);
    mouseMove = true;
  }, false);

canvas.addEventListener('mousedown', function(event){
    if(p.ammo > 0){
      var ltemp = createLazer(p);
      lazers.push(ltemp);
      socket.emit('lazer', {lazer:ltemp});
      p.ammo--;
    }
  }, false);

  var dx = 0;
  var dy = 0;

  var maxx = 38;
  var minn = -38;


  currentCanvas = setInterval(drawBoard, 20);
  
  function drawBoard(){
    ctx.clearRect(0,0, 4000, 4000);

    ctx.drawImage(img, 0, 0, 4000, 4000);
    
    
    var wheight = ($(window).height())/2;
    var wwidth = ($(window).width())/2; 
    window.scrollTo(2000-wwidth+p.x, 2000-wheight+p.y);
   
    if(mouseMove == true){

      if(p.x > mousePos.x) dx = (-p.x+mousePos.x)*0.08;
      else dx = (mousePos.x - p.x)*0.08;
      if(p.y > mousePos.y) dy = (-p.y+mousePos.y)*0.08;
      else dy = (mousePos.y - p.y)*0.08;
    }


    if(dx > maxx){
      dx = maxx;
    }else if(dx < minn){
      dx = minn;
    } 
    if(dy > maxx){
      dy = maxx;
    }else if(dy < minn){
      dy = minn;
    }
    checkcollision(p , dx, dy);

    if(collision != 1){
      p.x += dx;
      p.y += dy;
    }else{
      collision = 0;
      checkcollision(p , dx, 0);
      if(collision != 1){
        p.x += dx;
      } else{
        collision = 0;
        checkcollision(p , 0, dy);
        if(collision != 1){
          p.y += dy;

        }
      }

      var len;
      collision = 0;
    }
    rad = 45;
    len = Math.abs(dx)+ Math.abs(dy);

    var lx = rad*(dx/len);
    var ly = rad*(dy/len);

    if(lx != rad && ly != rad){
      var angle = (Math.atan2(lx, ly));
      lx = rad*Math.sin(angle);
      ly = rad*Math.cos(angle);
    }

    p.sx = lx;
    p.sy = ly;

    
    socket.emit('movement',{ pid: pnum, x: p.x, y: p.y, sx: p.sx, sy:p.sy});

    for(var i = 0; i < players.length; i++){
      if(players[i] != null)
        createPlayer(players[i]);
    }
    updateLazers();
    mouseMove = false;
  }
}


function Player(x, y, sx, sy, color) {
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.color = color;
    this.origX = x;
    this.origY = y;
    this.radius = 50;
    this.ammo = 99;
}

function Lazer(p){
  
  this.len = 30;
  this.x = p.x+(p.sx*0.1);
  this.y = p.y+(p.sy*0.1);
  this.dx = 2*p.sx;
  this.dy = 2*p.sy;
  this.bounce = 1;
  this.playerNum = pnum; 
}

function createPlayer(p){
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, 2*Math.PI, true);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();

  ctx.moveTo(p.x+p.sx, p.y +p.sy);
  ctx.lineTo(p.x, p.y);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#C6C6C6';
  ctx.stroke();
  ctx.closePath();
}

function updateLazers(){
  for(var i = 0; i < lazers.length; i++){
    var lazr = lazers[i];

    var pidkill = -1;
    pidkill = checkLazerCollision(lazr, lazr.x, lazr.y, lazr.x + lazr.dx, lazr.y + lazr.dy)
    lazr.x += (lazr.dx);
    lazr.y += (lazr.dy);    
    if(lazr.x < 0 || lazr.y < 0 || lazr.x > 4000 || lazr.y > 4000)
      lazerHit = 3;

    switch(lazerHit){
      case 1:
        lazr.dx = -lazr.dx;
        drawLazer(lazr);
        break; 

      case 2:
        lazr.dy = -lazr.dy;
        drawLazer(lazr);
        break;
      case 3:
        lazers.splice(i, 1);
        i--;
        break;
      case 4:
        lazers.splice(i, 1);
        socket.emit('kill', {pkld: pidkill, pklr : lazr.playerNum}); 
        i--;
        break;

      default:
        drawLazer(lazr);
        break;  
    }
    lazerHit = 0;
  }
}

function drawLazer(lazr){
  var posx = players[pnum-1].x;
  var posy = players[pnum-1].y;
  //Control lazers, only load for user's window - All else still calculated
  if(lazr.x <= (posx + initWidth) && lazr.x >= (posx - initWidth) 
      && lazr.y <= (posy + initHeight) && lazr.y >= (posy - initHeight)){
    ctx.beginPath();
    ctx.moveTo(lazr.x, lazr.y);
    ctx.lineTo(lazr.x + lazr.dx, lazr.y + lazr.dy);
    ctx.lineWidth = 5;
    ctx.strokeStyle='#FF00FF';
    ctx.stroke();
  }
}

function createLazer(p){
  var temp = new Lazer(p);
  return temp;
}

function checkcollision(p, x, y) {
  //var imgd = ctx.getImageData(p.x+x-40, p.y+y-40, 80, 80);
  //var pix = imgd.data;

  var nx =p.x + x-40;
  var ny =p.y + y-40;
  nx = Math.round(nx);
  ny = Math.round(ny);
  for(var i = ny; n = (ny+80), i < n; i++){
      for(var j = nx; t = (nx+80), j < t; j++){
        var temp = ((i*4000) + j);
        if(spaceControl[temp]){
          collision = 1;
          //console.log(spaceControl[0]);
          //console.log("YAYAYAYAYAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
          break;
        }  
      }
      
  }
  if(collision == 0){
    if(nx < 0 || ny < 0 || (nx+80) > 4000 || (ny+80) > 4000) collision = 1;
  }
  /*
  if(collision == 0){

  }
  for (var i = x; n = pix.length, i < n; i += 4) {
    if (pix[i] == 0 || pix[i] == 1) {
      collision = 1;
    }*/
  //}
  /*console.log("here1");
  for(var i = 0; i < 360; i++){
    x = p.x+x + p.radius * Math.cos(i*(Math.PI/180));
    y = p.y+y + p.radius * Math.sin(i*(Math.PI/180));
    idx = (y * 4000 + x) * 4
    console.log("check");
    console.log(pix.length);

    if (pix[idx] == 0 || pix[idx] == 1) {
      collision = 1;
      break;
    }
  }*/
}

function checkLazerCollision(lazer, startx, starty, endx, endy) {
  /*var minx = Math.min(startx, endx);
  var miny = Math.min(starty, endy);
  var maxx = Math.max(startx, endx);
  var maxy = Math.max(starty, endy);
  var w = Math.abs(startx - endx);
  var h = Math.abs(starty - endy);*/
  startx = Math.round(startx);
  starty = Math.round(starty);
  endx = Math.round(endx);
  endy = Math.round(endy);
  midx = (Math.max(endx, startx) - Math.min(endx, startx))*0.5 +startx;
  midy = (Math.max(endy, starty) - Math.min(endy, starty))*0.5 +starty;

  /*for (var i = 0; n = pix1.length, i < n; i += 4) {     
      if(pix1[i] == 0 || pix1[i] == 1){
      lazerHit = 3;
      break; 
    }
  }*/
  if(spaceControl[(starty * 4000) + startx]){
    lazerHit = 3;
  }
  hitp = hitPlayer(lazer, startx, starty, endx, endy);
  if(hitp > 0 && lazerHit == 0){
    lazerHit = 4;
  }else{

  //var imgd = ctx.getImageData(endx-8, endy-8, 15, 15);
  //var pix = imgd.data;
  
  /*var imgd1 = ctx.getImageData(maxx, miny, 1, h);
  var pix1 = imgd1.data;*/
  //var j = 0;
  for(var k = (endy -10); t = (endy+7), k < t; k++){
    for (var i = (endx - 10); n = (endx+7), i < n; i ++) {
      var temp = (k*4000) + i;
      if (spaceControl[temp]){
        lazerHit = 3;
        break; 
      }
    }
  }
  for(var k = (midy -7); t = (endy+7), k < t; k++){
    for (var i = (midx - 7); n = (endx+7), i < n; i ++) {
      var temp = (k*4000) + i;
      if (spaceControl[temp]){
        lazerHit = 3;
        break; 
      }
    }
  }
  

    //if(j < pix1.length)
     // j+=4;
        /*if(lazer.bounce == 0){
          lazerHit = 3;
          break;
        }else{
          lazerHit = 1;
          lazer.bounce--;
          break;
        }
      }
    }
    
    if(lazerHit == 0){
      for (var i = 0; n = pix1.length, i < n; i += 4) {
      if (pix1[i] == 0 || pix1[i] == 1) {
        if(lazer.bounce == 0){
          lazerHit = 3;
          break;
        }else{
          lazerHit = 2;
          lazer.bounce--;
          break;
        }
      }*/
   // }
  }
  /*if(lazerHit != 0){
    console.log("WALLLLL");
  }*/
  return hitp;
}

function hitPlayer(laser, startx, starty, endx, endy){
  
  for(var i = 0; i < players.length; i++){
    var p = players[i];
    if(laser.playerNum != i+1 && p != null){
    if(endx < (p.x + p.radius) && endx > (p.x - p.radius)
          && endy< (p.y + p.radius) && endy > (p.y - p.radius)){
      return (i+1);
    }else if(endx < (p.x + p.radius) && endx > (p.x - p.radius)
          && endy-10 < (p.y + p.radius) && endy+10 > (p.y-p.radius)){
      return (i+1);
    }else if(endy < (p.y + p.radius) && endy > (p.y - p.radius)
          && endx-10 < (p.x + p.radius) && endx+10 > (p.x-p.radius)){

      return (i+1);
    }
  }
  }
 return -1;

}

function getMousePos(canvas, event) {
  
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
    y: Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
  };
}

playGame();