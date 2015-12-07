var canvas = document.getElementById('game');
var ctx = game.getContext("2d");
var pColor = 'black'
var p1 = new Ball(75,75, 0, 45, '#FF0000');
var p2 = new Ball(3925,3925, 0, -45, '#00FF00');
var p3 = new Ball(3925,75, -45, 0, '#0000FF');
var p4 = new Ball(75,3925, 45, 0, '#FFFF00');
var pnum;
//added
var socket = io();
// end added

var mouseMove;
var mousePos;
var collision = 0;

var currentCanvas;
var img = new Image();

img.onload = function() {
  ctx.drawImage(img, 0, 0, 4000, 4000);
  createPlayer(p1);
  createPlayer(p2);
  createPlayer(p3);
  createPlayer(p4);
};

img.src = "/images/gameboard.jpg";

function playGame(){
  var p; 
  console.log('poop');
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
  
  canvas.addEventListener('mousemove', function(event){
    mousePos = getMousePos(canvas, event);
    mouseMove = true;
  }, false);
  var dx = 0;
  var dy = 0;

  var maxx = 48;


  currentCanvas = setInterval(drawBoard, 10);
  
  function drawBoard(){
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
    } 
    if(dy > maxx){
      dy = maxx;
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
      

      //var tempY = mousePos.y - p.y;

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
    createPlayer(p1);
    createPlayer(p2);
    createPlayer(p3);
    createPlayer(p4);
    mouseMove = false;
  }
}


function Ball(x, y, sx, sy, color) {
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.color = color;
    this.origX = x;
    this.origY = y;
    this.radius = 50;
}

function createPlayer(p){
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, 2*Math.PI, true);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.closePath();


//var sx = mousePos.x + radFromMouse*Math.cos(angle/360*2*Math.PI);
//var sy = mousePos.y + radFromMouse*Math.sin(angle/360*2*Math.PI);
  

  ctx.beginPath();



  ctx.moveTo(p.x+p.sx, p.y +p.sy);
  ctx.lineTo(p.x, p.y);
  ctx.lineWidth = 10;
  //ctx.strokeStyle = '#CCCACA';
  ctx.strokeStyle = '#C6C6C6';
  ctx.stroke();
  ctx.closePath();
  
}

function checkcollision(p, x, y) {
  var imgd = ctx.getImageData(p.x+x-50, p.y+y-50, 100, 100);
  var pix = imgd.data;
  for (var i = 0; n = pix.length, i < n; i += 4) {
  if (pix[i] == 0 || pix[i] == 1) {
  collision = 1;
}
}
}



function getMousePos(canvas, event) {
  
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
    y: Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
  };
}

playGame();