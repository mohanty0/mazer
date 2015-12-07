var canvas = document.getElementById('game');
var ctx = game.getContext("2d");
var pColor = 'black'
var p1 = new Ball(75,75, 0, 0, '#FF0000');
var p2 = new Ball(3925,3925, 0, 0, '#00FF00');
var p3 = new Ball(3925,75, 0, 0, '#0000FF');
var p4 = new Ball(75,3925, 0, 0, '#FFFF00');

var mouseMove;
var mousePos;
var collision = 0;

var currentCanvas;
var img = new Image();

img.onload = function() {
    //ctx.clearRect(0, 0, 4000, 4000);


  ctx.drawImage(img, 0, 0, 4000, 4000);
  createPlayer(p1);
  createPlayer(p2);
  createPlayer(p3);
  createPlayer(p4);
};

img.src = "images/gameboard.jpg";

function playGame(){
  canvas.addEventListener('mousemove', function(event){
    mousePos = getMousePos(canvas, event);
    mouseMove = true;
  }, false);
  

  currentCanvas = setInterval(drawBoard, 10);
  
  function drawBoard(){
    ctx.drawImage(img, 0, 0, 4000, 4000);
    var dx = 0;
    var dy = 0;
    if(mouseMove == true){

      if(p1.x > mousePos.x) dx = (-p1.x+mousePos.x)*0.08;
      else dx = (mousePos.x - p1.x)*0.08;
      if(p1.y > mousePos.y) dy = (-p1.y+mousePos.y)*0.08;
      else dy = (mousePos.y - p1.y)*0.08;

    }

    checkcollision(p1.x + dx, p1.y + dy);


    if(collision != 1){
      p1.x += dx;
      p1.y += dy;
    }else{
      collision = 0;
    }

    createPlayer(p1);
    createPlayer(p2);
    createPlayer(p3);
    createPlayer(p4);
    //mouseMove = false;
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

function checkcollision(x, y) {
  var imgd = ctx.getImageData(x, y, 50, 50);
  var pix = imgd.data;
  for (var i = 0; n = pix.length, i < n; i += 4) {
  if (pix[i] == 0) {
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