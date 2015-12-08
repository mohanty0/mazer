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

img.onload = function() {
  ctxboard.drawImage(img, 0, 0, 4000, 4000);
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

socket.on('kill', function(data) {
  //if data.pkld is self, end game
  if(data.pkld == pnum){
    clearInterval(currentCanvas);
  }else{
    players.splice(data.pkld-1, 1);
  }
  // else remove which ever player it is. 
});

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
  //});

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

  var maxx = 48;
  var minn = -48;


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


    checkcollision(p , dx, dy);

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

    //AYAYAYAY
     /* if (player shoots) {
      //check kill 
      if (kill) {
        socket.emit('kill', {pkld: playerThatGotKilled, pklr : playerThatKilled}); 
      }
    }
    
    */
    for(var i = 0; i < players.length; i++){
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
  this.x = p.x+(p.sx*0.2);
  this.y = p.y+(p.sy*0.2);
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
    lazr.x += (lazr.dx);
    lazr.y += (lazr.dy);
    var pidkill = -1;
    pidkill = checkLazerCollision(lazr, lazr.x, lazr.y, lazr.x + lazr.dx, lazr.y + lazr.dy)
    
    if(lazr.x < 0 || lazr.y < 0 || lazr.x > 4000 || lazr.y > 4000)
      lazerHit = 2;

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
        console.log(pidkill);
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
  ctx.beginPath();
  ctx.moveTo(lazr.x, lazr.y);
  ctx.lineTo(lazr.x + lazr.dx, lazr.y + lazr.dy);
  ctx.lineWidth = 5;
  ctx.strokeStyle='#FF00FF';
  ctx.stroke();
}

function createLazer(p){
  var temp = new Lazer(p);
  return temp;
}

function checkcollision(p, x, y) {
  var imgd = ctx.getImageData(p.x+x-40, p.y+y-40, 80, 80);
  var pix = imgd.data;
  for (var i = 0; n = pix.length, i < n; i += 4) {
    if (pix[i] == 0 || pix[i] == 1) {
      collision = 1;
    }
  }
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

  var hitp = -1;

  var imgd = ctx.getImageData(endx-15, endy-15, 20, 20);
  var imgd1 = ctx.getImageData(startx-15, starty-15, 20, 20);
  var pix = imgd.data;
  var pix1 = imgd1.data;
  /*var imgd1 = ctx.getImageData(maxx, miny, 1, h);
  var pix1 = imgd1.data;*/
  var j = 0;
  for (var i = 0; n = pix.length, i < n; i += 4) {
    if (pix[i] == 0 || pix[i] == 1 || pix1[j] == 0 || pix1[j] == 1){
      lazerHit = 3;
      break; 
    }
    if(j < pix1.length)
      j+=4;
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
  hitp = hitPlayer(lazer, startx, starty, endx, endy);
  if(hitp > 0 && lazerHit == 0){
    lazerHit = 4;
  }
  return hitp;
}

function hitPlayer(laser, startx, starty, endx, endy){
  
  for(var i = 0; i < players.length; i++){
    var p = players[i];
    if(laser.playerNum != i+1){
    if(laser.x < (p.x + p.radius) && (laser.x) > (p.x - p.radius)
          && laser.y < (p.y + p.radius) && (laser.y) > (p.y - p.radius)){
      console.log("shooost1" + (i+1));
      return (i+1);
    }else if(laser.x < (p.x + p.radius) && (laser.x) > (p.x - p.radius)
          && laser.y-10 < (p.y + p.radius) && laser.y+10 > (p.y-p.radius)){
            console.log("shooost2" + (i+1));

      return (i+1);
    }else if(laser.y < (p.y + p.radius) && (laser.y) > (p.y - p.radius)
          && laser.x-10 < (p.x + p.radius) && laser.x+10 > (p.x-p.radius)){
            console.log("shooost3" + (i+1));

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