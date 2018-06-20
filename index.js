document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
  createBoard();
  drawBoard(squaresArray);
  player = new Player('img/mainDude.png');
  
  drawActor(player);
});

////// Variables & Constants //////
var tiles = document.getElementById("tiles");
var actors = document.getElementById("actors");

const boardWidth = 10;
const boardHeight = 10;
const squareSide = 51;

var squaresArray = [];
var moveArray = [];
var player = null;
var gameState = "NORMAL";

////// Functions //////
function createBoard(){
    var z=0;
    for(var i = 0; i < boardHeight; i++){
        for(var j = 0; j < boardWidth; j++){
            var crd = new Coordinate(j, i);
            squaresArray[z] = new Square(crd, "plains");
            z++;
        }
    }
}

function drawActor(actor){
    var ctx = actors.getContext("2d");

    var img = new Image();
    img.src = actor.sprite;
    
    img.onload = function(){
        var ctx = actors.getContext("2d");
        actor;
        ctx.drawImage(img, (actor.position.x*squareSide+squareSide/2)-(img.width/2), (actor.position.y*squareSide+squareSide/2)-(img.height/2));
    }.bind(actor);

}

function drawBoard(board){
    for(var i = 0; i < board.length; i++){
        var sqr = board[i]
        fillSquare(sqr.coordinates, "green");
        drawSquare(sqr.coordinates);
    }
}

function drawSquare(crd){
    var ctx = tiles.getContext("2d");
    x = crd.x*squareSide;
    y = crd.y*squareSide;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + squareSide);
    ctx.lineTo(x + squareSide, y + squareSide);
    ctx.lineTo(x + squareSide, y);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function fillSquare(crd, colour){
    var ctx = tiles.getContext("2d");
    ctx.fillStyle = colour;
    ctx.fillRect(crd.x*squareSide, crd.y*squareSide, squareSide, squareSide);
}

function clearActor(actor){
    var ctx = actors.getContext("2d");
    ctx.clearRect(actor.position.x*squareSide, actor.position.y*squareSide, squareSide, squareSide);
}

////// Listeners //////

actors.addEventListener('click', (e) => {
    const pos = new Coordinate(
        Math.floor((e.clientX-10)/squareSide),
        Math.floor((e.clientY-10)/squareSide)
    );
    switch(gameState){
        case "NORMAL":
            if(pos.x==player.position.x && pos.y==player.position.y){
                beginMove(pos);
            }
            break;
        case "MOVING":
            for(var i = 0; i<moveArray.length; i++){
                if(pos.x==moveArray[i].x && pos.y==moveArray[i].y){
                    executeMove(pos);
                    break;
                }
            }
            break;
        default:
            alert("Unknown game state!");
    }
});

function beginMove(pos){
    if(pos.x>0){
        moveArray.push(new Coordinate(player.position.x-1, player.position.y));
    }
    if(pos.y>0){
        moveArray.push(new Coordinate(player.position.x, player.position.y-1));
    }
    if(pos.x<boardWidth-1){
        moveArray.push(new Coordinate(player.position.x+1, player.position.y));
    }
    if(pos.y<boardWidth-1){
        moveArray.push(new Coordinate(player.position.x, player.position.y+1));
    }
    
    for(var i = 0; i<moveArray.length; i++){
        fillSquare(moveArray[i], "blue");
        drawSquare(moveArray[i]);
    }

    gameState = "MOVING";
}

function executeMove(pos){
    for(var i = 0; i<moveArray.length; i++){
        fillSquare(moveArray[i], "green");
        drawSquare(moveArray[i]);
    }
    clearActor(player);
    player.position = pos;
    drawActor(player);
    moveArray = [];
    gameState = "NORMAL";
}

////// Classes //////
var Square = function(crd, terrain){
    this.coordinates = crd,
    this.terrain = terrain
}

var Coordinate = function(x, y){
    this.x = x,
    this.y = y
}

var Player = function(sprite){
    this.sprite = sprite,
    this.score = 0,
    this.hp = 10,
    this.ap = 5,
    this.position = new Coordinate(3,4)
}