var canvas = document.getElementById('game');
var ctx = game.getContext("2d");
var pColor = 'black'
var p1 = new Ball(75,75, 0, 0, '#FF0000');
var p2 = new Ball(3925,3925, 0, 0, '#00FF00');
var p3 = new Ball(3925,75, 0, 0, '#0000FF');
var p4 = new Ball(75,3925, 0, 0, '#FFFF00');
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
      collision = 0;
    }
    //console.log('before emit before on');
    socket.emit('movement',{ pid: pnum, x: p.x, y: p.y});
    //console.log('after emit before on');
    socket.on('movement', function(data) {
     // console.log('poop2');
      //console.log(data);
      if(data.pid != pnum){

      switch (data.pid) {
        case 1:
          p1.x=data.x;
          p1.y=data.y;
          break;
        case 2: 
          p2.x=data.x;
          p2.y=data.y;
          break;
        case 3: 
          p3.x=data.x;
          p3.y=data.y;
          break;
        case 4: 
          p4.x=data.x;
          p4.y=data.y;
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


function Ball(x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
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