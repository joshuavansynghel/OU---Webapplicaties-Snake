import * as settings from "./settings.js";
import {setMaxCoordinates} from "./settings.js";
import {initSnakeGame, resetSnakeGame, moveSnakeAndResolveCollisions, getSnakeSegments, getFoods, getGameStatus} from "./snakeGame.js";
import {place} from "./snakeGame.js";    
	
//Aanvullling Laurens	
import {resetScore} from "./score.js";	
import {resetNameWinner} from "./winnaar.js";


import {enterWinnerNameTimer} from "./controllerDeux.js";	
import {resetScoreField} from "./controllerDeux.js";	
import {removeNameInputFields} from "./controllerDeux.js";	
import {gewonnen} from "./controllerDeux.js";	
import {initEntriesScoreBoard} from "./controllerDeux.js";	
import {setScoreField} from "./controllerDeux.js";  


var width,                             // breedte van het tekenveld
    height,                            // hoogte van het tekenveld

    snaketimer,

    lastPressedArrowKey = settings.UP; // string van de laatst gedrukte arrow key


$(document).keydown(function (e) {
    switch (e.code) {
    case "ArrowLeft":
       lastPressedArrowKey = settings.LEFT;
       break;
    case "ArrowUp":
       lastPressedArrowKey = settings.UP;
       break;
    case "ArrowRight":
       lastPressedArrowKey = settings.RIGHT;
       break;
    case "ArrowDown":
       lastPressedArrowKey = settings.DOWN;
       break;
    }
});

$(document).ready(function () {
    getDimensionsCanvas();
    setMaxCoordinates(width, height);
    $("#stopSnake").click(stop);
    $("#startSnake").click(start);
});

/**
  @function getDimensionsCanvas() -> void
  @desc Haal de hoogte en wijdte van het canvas op via het DOM-object
        en sla deze op in variabelen
*/
function getDimensionsCanvas() {
    width = $("#mySnakeCanvas").innerWidth();
    height = $("#mySnakeCanvas").innerHeight();
}

function stop() {
    $("#mySnakeCanvas").clearCanvas();
    clearInterval(snaketimer);
    resetSnakeGame(); 
}

function start() {
    initSnakeGame();
    
		//Aanvulling Laurens
		resetScore();
		resetScoreField();
		removeNameInputFields();
		resetNameWinner();
		clearInterval(enterWinnerNameTimer);
		initEntriesScoreBoard();
	//Aanvulling Laurens
	
	
	draw();
    snaketimer = setInterval(function() {
        updateSnakeGame();}, settings.SLEEPTIME); 
}

function updateSnakeGame() {
	moveSnakeAndResolveCollisions(lastPressedArrowKey);
	draw();
	determineResult();
    setScoreField();
}

function determineResult(){
	let status = getGameStatus();
	switch(status) {
		case settings.WON:
			stop();
			drawGewonnen();
			gewonnen(place);
			break;
		case settings.LOST:
			stop();
			drawVerloren();
			break;

	}
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel op het canvas
*/
function draw() {
    var canvas = $("#mySnakeCanvas").clearCanvas();
    drawElements(getSnakeSegments(), canvas);
    drawElements(getFoods(), canvas);
}

/**
  @function drawElements(elements, canvas) -> void
  @desc Elementen tekenen
  @param [Element] array van elementen
  @param {dom object} canvas het tekenveld
 */
function drawElements(elements, canvas) {
    elements.forEach(function (element) {
        drawElement(element, canvas);
    });
}

/**
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen 
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
*/
 function drawElement(element, canvas) {
    canvas.drawArc({
        draggable : false,
        fillStyle : element.color,
        x : element.x,
        y : element.y,
        radius : element.radius
    });
}

/**
  @function drawVerloren -> void
  @desc Teken een afbeelding op het canvas dat duidelijk aangeeft dat gebruiker is verloren
*/
function drawVerloren() {
    $("#mySnakeCanvas").drawImage({
    source: 'img/sad_snake.jpg',
    x: 210, y: 240,
    scale : 0.5
    });
}


function drawGewonnen() {
	$("#mySnakeCanvas").drawImage({
	source: 'img/newHighScore.jpg',
	x: 230, y: 190,
	scale : 1
	});
}



