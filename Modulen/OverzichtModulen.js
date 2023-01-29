
/***************************************************************************
 **                MODULE SETTINGS                                       **
 ***************************************************************************/
 

export const R        = 10,          // straal van een element
             STEP     = 2*R,         // stapgrootte
                                     // er moet gelden: WIDTH = HEIGHT
             LEFT     = "left",      // bewegingsrichtingen 
             RIGHT    = "right",
             UP       = "up",
             DOWN     = "down",

             ACTIVE   = "active",
             INACTIVE = "inactive",
             WON      = "won",
             LOST     = "lost",


             NUMFOODS = 30,          // aantal voedselelementen 

             XMIN     = R,           // minimale x waarde
             YMIN     = R,           // minimale y waarde
      
             SLEEPTIME = 200,        // aantal milliseconde voor de timer

             SNAKE   = "DarkRed",    // kleur van een slangsegment
             FOOD    = "Olive",      // kleur van voedsel
             HEAD    = "DarkOrange", // kleur van de kop van de slang

             WAITFORNAMEWINNER = 1000;

export var   xMax,
             yMax;

export function setMaxCoordinates(width, height) {
    xMax = width - R;
    yMax = height - R;
}


/***************************************************************************
 **                MODULE SETTINGS                                       **
 ***************************************************************************/
 


/***************************************************************************
 **                MODULE ELEMENT                                       **
 ***************************************************************************/
 
/**
  @constructor Element
  @param radius straal
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaat middelpunt
  @param {string} color kleur van het element
*/ 
export function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
}

/**
  @function collidesWithOneOf(elements) -> boolean
  @desc Geef aan dit element bots met een andere array van elementen
  @param [Element] elements een array van elementen
  @return {boolean} false indien dit element niet botst met 1 van
                    de andere elementen in de array
                    true indien wel
*/
Element.prototype.collidesWithOneOf = function(elements) {
    //console.log("elements: " + JSON.stringify(elements))
    var xcoordinaat = this.x;
    var ycoordinaat = this.y;
    return elements.some(function(el) {
        return xcoordinaat == el.x && ycoordinaat == el.y;
    });
}

/***************************************************************************
 **                MODULE ELEMENT                                       **
 ***************************************************************************/
 
 
 
/***************************************************************************
 **                MODULE FOOD                                       **
 ***************************************************************************/

import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
export function createFoods(snake) {   
   var  i = 0,    
        food,
        foods = [];
   console.log("snake:" + JSON.stringify(snake));
   while (i < settings.NUMFOODS ) {
     food = createFood(settings.XMIN + getRandomMultipleOfRadius(0, settings.xMax), 
                        settings.YMIN + getRandomMultipleOfRadius(0, settings.yMax));
     console.log("food: " + food + " and snake: " + JSON.stringify(snake.segments));
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
       foods.push(food);
       i++
     }
   }
   return foods;  
}

/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
    return new Element(settings.R, x, y, settings.FOOD);
}

/**
  @function getRandomMultipeOfRadius(min: number, max: number) -> number
  @desc Creeren van random veelvoud van het dubbele van de radius in het interval [min, max]
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max && (x % (2*R)) = 0
*/
function getRandomMultipleOfRadius(min, max) {
    var res;

    //genereer willekeurig getal dat deelbaar is door 2*R
    //dit zorgt ervoor dat x en y zo gekozen worden dat ze mooi op canvas worden afgebeeld
    res = getRandomInt(min, Math.floor(max / (2 * settings.R))) * 2 * settings.R;
    return res;
}

/**
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max] 
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
  @throws {Error} Het moeten gehele getallen van 0 of groter zijn
  @throws {Error} Het eerste argument moet kleiner of gelijk aan het tweede argument zijn
*/
function getRandomInt(min, max) {
    var res;
    if (isPosInteger(min) && isPosInteger(max) && min <= max) {
        res = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    else if(!(isPosInteger(min) && isPosInteger(max))) {
        throw Error("Het moeten gehele getallen van 0 of groter zijn");
    }
    else {
        throw Error("Het eerste argument moet kleiner of gelijk aan het tweede argument zijn")
    }
    return res;
}

/**
  @function isPosInteger(x: number) -> boolean
  @desc Bepalen of het gaat om een positief geheel getal
  @param {number} een getal
  @return {boolean} false bij:
                       - geen getal
                       - kleiner dan 0;
                    anders true
*/
function isPosInteger(x) {
    return x >= 0 && Number.isInteger(x);
}
 
/***************************************************************************
 **                MODULE FOOD                                         **
 ***************************************************************************/
 
 
 
 
 
/***************************************************************************
 **                MODULE SNAKE                                       **
 ***************************************************************************/
 
import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @constructor Snake
  @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
*/ 
function Snake(segments) {
    this.segments = segments;
    this.direction = settings.UP;
}

/**
  @function getDirection() -> string
  @desc Get de huidige richting van de slang
  @return {string} direction richting van de slang
*/
Snake.prototype.getDirection = function() {
    return this.direction;
}

/**
  @function setDirection(direction) -> void
  @desc Set een nieuwe richting aan de slang
  @param {string} direction nieuwe richten van de slang 
*/
Snake.prototype.setDirection = function(direction) {
    this.direction = direction;
}

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
export function createStartSnake() {
    let width = settings.xMax + settings.R;
    let height = settings.yMax + settings.R;

    //console.log("width:" + width + " and height: " + height);

    var segments   = [createSegment(width/2, height/2), 
                      createHead(width/2, height/2 - 2 * settings.R)];
    return new Snake(segments);
    } 
    
/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
    return new Element(settings.R, x, y, settings.SNAKE);
}

/**
  @function createHead(x,y) -> Element
  @desc Head slang creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color HEAD
*/
export function createHead(x, y) {
    return new Element(settings.R, x, y, settings.HEAD);
}

 
/***************************************************************************
 **                MODULE SNAKE                                       **
 ***************************************************************************/



/***************************************************************************
 **                 MODULE SCORE                                       **
 ***************************************************************************/
 
 
var score = 0; 


/**
  @function  setScore(newScore) -> void
  @desc pas de score aan 
  @param {string} newScore de nieuwe waarde van de score
  */	
export function setScore(newScore){
	score = newScore;
} 


/**
  @function getScore() -> string
  @desc geeft de huidige score van het spel
  @return {string} score de huidige score van het spel
  */	
export function getScore() { 
	return score; 
}


/**
  @function changeScore() -> void
  @desc veranderd de score met 10 punten
  */	
export function changeScore() { 
	score = score + 10;
} 


/**
  @function resetScore() -> void
  @desc reset de score van het spel naar 0
  */		
export function resetScore() { 
	score = 0;
} 



/***************************************************************************
 **                 MODULE SCORE                                       **
 ***************************************************************************/


/***************************************************************************
 **                 MODULE WINNAAR                                 **
 ***************************************************************************/
 

var nameWinner;

 
/**
  @function getNameWinner() -> string
  @desc geeft de naam van de winnaar
  @return {string} de naam van de winnaar
  */		
export function getNameWinner() { 
	return nameWinner; 
} 


/**
  @function resetScore() -> string
  @desc geeft de naam van de winnaar
  @param naam van de winnaar
  */		
export function setNameWinner(name) { 
	nameWinner = name;
} 

/**
  @function resetNameWinner() -> void
  @desc zet de naam van de winnaar naar undefined
  */	
export function resetNameWinner() { 
	nameWinner = undefined;
} 



/***************************************************************************
 **                 MODULE WINNAAR                                 **
 ***************************************************************************/
 


/***************************************************************************
 **                MODUE SCOREBOARDENTRIES                                     **
 ***************************************************************************/
 import {getNameWinner} from "./winnaar.js";
import {getScore} from "./score.js";

var entriesScoreboard;
	

/**
  Construcor EntryScore(name, scored)
  @desc Creeer een entry voor het scoreboard
  @param {string}name de naam van de winnaar
  @param {string} scored de score van de winnaar 
 */
function EntryScore(name, scored) { 
	this.name = name;
	this.score = scored;
} 


/**
  @function addScoreBoardEntries(entriesLocalStorage) -> void
  @desc geeft de variabele entriesScoreboard een lege map, kent aan deze map standaard keys toe, vult de map met de entries uit de local storage en 
  vult de lege keys aan met entryScore objecten
  @param {map(String, EntryScore)} entriesLocalStorage scoreboard entries uit de local storage van de webbrowser
 */
export function addScoreBoardEntries(entriesLocalStorage){ 
	setKeysScoreboard();
	setEntriesScoreBoard(entriesLocalStorage);
	completeEntriesScoreboard();
} 


/**
  @function setKeysScoreboard() -> void
  @desc initieer de variabele met de entries van het scorebord, door toekenning van 
  een Map()object met de vast keys: placeThree, placeTwo, placeOne. 
  */
function setKeysScoreboard() { 
	entriesScoreboard = new Map();
	entriesScoreboard.set("placeThree", );
	entriesScoreboard.set("placeTwo", );
	entriesScoreboard.set("placeOne", );
} 


/**
  @function setEntriesScoreBoard(entriesLocalStorage) -> void
  @desc vul de entries
  */
function setEntriesScoreBoard(entriesLocalStorage) { 
	let entries = entriesLocalStorage;
	entries.forEach((entryScore, key) => { 
		entriesScoreboard.set(key, entryScore);
	}); 
}	
	

/**
  @function completeEntriesScoreboard() -> void
  @desc als in de map entriesScoreboard één van de 3 keys geen EntrieScore als waarde heeft, 
  dan krijgt deze key als waarde een EntryScore object zonder naam en met score 0. 
  */	
function completeEntriesScoreboard() { 
	let places = ["placeOne", "placeTwo", "placeThree"];
	places.forEach(key => { 
		if(entriesScoreboard.get(key) === undefined) { 
			entriesScoreboard.set(key, new EntryScore("", 0));
		} 
	});	
} 


/**
  @function getEntriesScoreBoard() -> map(string, EntryScore)
  @desc geef de huidige entries van het scorebord. 
  */
export function getEntriesScoreBoard() { 
	return entriesScoreboard;
}


/**
  @function scoreIsNewHigh(score) -> string
  @desc bepaal of de behaalde score een nieuwe high score is (top 3)
  @param {string} behaalde score van de winnaar
  @return {string} behaald plaats van de score in het scorebord, bij geen 
  high score is de returnwaarde "noHighscore".
  */	
export function scoreIsNewHigh() { 
	let newPlace = "noHighscore"; 
	let scored = getScore();
	let intermediateScore = 0; 
	console.log(entriesScoreboard);
	entriesScoreboard.forEach((entry, key) => { 
		let entryScore = entry.score; 
		if (+scored >= +entryScore && +entryScore >=  +intermediateScore){ 
			intermediateScore = entryScore;
			newPlace = key;	
		}
	}); 
	console.log(newPlace);
	return newPlace;
} 


/**
  @function adjustentriesScoreboard(place, nameWinner) -> void
  @desc pas het score bord aan met een nieuw behaalde high score
  @param {string} place plek van de behaalde high score (placeOne, placeTwo, placeThree)
  @param {string} nameWinner naam van de winnaar
 */	
export function adjustEntriesScoreboard(newPlace, winner, scored) { 
		let place = newPlace;
		let newScore = scored;
		let nameWinner = winner;
		let newEntry = new EntryScore(nameWinner, newScore); 
		let entryPlaceTwo;
		switch (place) {
		case "placeOne": 
		let entryPlaceOne = entriesScoreboard.get("placeOne");
		entryPlaceTwo = entriesScoreboard.get("placeTwo");
		entriesScoreboard.set("placeOne", newEntry);
		entriesScoreboard.set("placeTwo",entryPlaceOne);
		entriesScoreboard.set("placeThree",entryPlaceTwo);
		break;
		case "placeTwo": 
		entryPlaceTwo = entriesScoreboard.get("placeTwo");
		entriesScoreboard.set("placeTwo",newEntry);
		entriesScoreboard.set("placeThree",entryPlaceTwo);
		break;
		case "placeThree": 
		entriesScoreboard.set("placeThree",newEntry);
		break;
		} 
} 

/***************************************************************************
 **                MODULE SCOREBOARDENTRIES                                     **
 ***************************************************************************/
 

 
/***************************************************************************
 **                MODULE SNAKEGAME                                     **
 ***************************************************************************/

import {Element} from "./element.js";
import {createStartSnake, createHead} from "./snake.js";
import {createFoods} from "./food.js";
import * as settings from "./settings.js";
import {changeScore} from "./score.js";
import {setScore} from "./score.js";
import {scoreIsNewHigh}  from "./EntriesScoreboard.js";
import {setScoreField}  from "./controllerDeux.js";


var snake,
    foods = [],                        // voedsel voor de slang
    snaketimer,                        // timer van de snake
    gameStatus = settings.INACTIVE;     // status van het spel

	export var place;


 export function getSnakeSegments() {
 	return snake.segments;
 }

 export function getFoods() {
 	return foods;
 }

 export function getGameStatus() {
    return gameStatus;
 } 
 
  export function setGameStatus(status) {
    gameStatus = status;
 } 


/**
  @function stopGame() -> void
  @desc Maak het canvas leeg, stop de timer, maak de array met voedsel leeg,
        maak status gameGestart false en maak lastPressedKey terug naar boven
*/
export function stopSnakeGame() { 
  
  /**
  //Aanvulling Laurens 
   clearInterval(enterWinnerNameTimer);
   resetScore();
   removeEnterNameFields();
   //Aanvulling Laurens
   **/
  
  foods = [];
  gameStatus = settings.INACTIVE
  //lastPressedArrowKey = settings.UP;
}

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, 
        cre\"eer een slang, genereer voedsel en teken deze elementen
        en start de timer die de slang doet bewegen
*/
export function initSnakeGame() {
    if(gameStatus = settings.INACTIVE) { 
        gameStatus = settings.ACTIVE;
        
        /**
		//Aanvulling Laurens
		fillScoreField();
		removeEnterNameFields();
		clearInterval(enterWinnerNameTimer);
		resetNameWinner();
		getContentLocalStorage();
		//Aanvulling Laurens
        */
		
		snake = createStartSnake();
        console.log("snake Init: " + snake);
        foods = createFoods(snake);
    }
}

/**
  @function move() -> void
  @desc Beweeg slang in de richting die het laatst met de pijljes werd gedrukt, corrigeer
        indien deze uit het canvas zou verdwijnen en verlies het spel indien slang botst
        met zichzelf
*/
export function move(lastPressedArrowKey) {
    //bepaal de richting van de volgende kop van de slang 
    determineDirection(lastPressedArrowKey);
    let newHead = createNewHead();

    //herbereken positie nieuwe head indien deze buiten het tekenveld zou vallen
    if (elementOutOfBounds(newHead)) {
        refitNewHeadToCanvas(newHead);
    }
	
	//aanvulling Laurens 
	let foodCollision = false; 
	let noFoodsLeft = foods.length <= 1;
	
	
      //behandel mogelijke collisions van slang en voedsel
	if (!newHead.collidesWithOneOf(snake.segments)) {
    	foodCollision = newHead.collidesWithOneOf(foods);
    	updateSnakeCoordinaten(newHead, foodCollision);
	} else {
        //gameStatus = LOST - vewerkt in determineResultGame() 
        determineResultGame();
    }
	if (foodCollision && noFoodsLeft) { 
        //gameStatus = WON - vewerkt in determineResultGame()
	    determineResultGame(); 
	}  
	if (foodCollision) { 
		setScoreField();
	} 
	
}

/**
  @function determineResultGame() -> void
  @desc bepaal of de eindscore een high score is en de winnaar dus heeft gewonnen
*/
function determineResultGame() { 
	//let result = getScore();
	place = scoreIsNewHigh();
	if(!place.includes("noHighscore")) { 
		setGameStatus(settings.WON); 
	} else {setGameStatus(settings.LOST);}
 } 


/**
  @function determineDirection() -> void
  @desc Wijzig de richting van de slang indien deze niet tegenovergesteld is met 
        de laatste drukte arrow key
*/
function determineDirection(lastPressedArrowKey) {
    if (!oppositeDirectionSnake(lastPressedArrowKey)) { 
        snake.setDirection(lastPressedArrowKey);
    }
} 

/**
  @function createNewHead() -> Element
  @desc Bereken de positie van het nieuwe hoofd van de slang indien deze binnen
        of buiten het canvas valt
  @return {Element} met straal R en color HEAD
*/
export function createNewHead() {
    let currentHead = snake.segments.at(-1);
    let newHead;

    //maak een nieuwe head aan op basis van laatst ingedrukte arrow key
    switch (snake.getDirection()) {
        case settings.UP:
            newHead = createHead(currentHead.x, currentHead.y - (2 * settings.R));
            break;
        case settings.DOWN:
            newHead = createHead(currentHead.x, currentHead.y + (2 * settings.R));
            break;
        case settings.LEFT:
            newHead = createHead(currentHead.x - (2 * settings.R), currentHead.y);
            break;
        case settings.RIGHT:
            newHead = createHead(currentHead.x + (2 * settings.R), currentHead.y);
            break;
    }
    return newHead;
}

/**
  @function oppositeDirectionSnake() -> boolean
  @desc Geef aan of de huidige richting van de slang tegenovergesteld is
        aan de laatste ingedrukte arrow key
  @return {boolean} false indien de huidige richting van slang en laatst gedrukte
                          arrowkey tegenovergesteld zijn
                    anders true
*/
function oppositeDirectionSnake(lastPressedArrowKey) {
    return (snake.getDirection() == settings.UP && lastPressedArrowKey == settings.DOWN) ||
            (snake.getDirection() == settings.DOWN && lastPressedArrowKey == settings.UP) ||
            (snake.getDirection() == settings.LEFT && lastPressedArrowKey == settings.RIGHT) ||
            (snake.getDirection() == settings.RIGHT && lastPressedArrowKey == settings.LEFT);
}

/**
  @function elementOutOfBounds(element) -> boolean
  @desc Geef aan of het element buiten het canvas valt
  @param {Element} element een Element object
  @return {boolean} false bij:
                       - element van buiten het canvas
                    anders true
*/
function elementOutOfBounds(element) {
    return element.x < settings.XMIN || element.x > settings.xMax ||
            element.y < settings.YMIN || element.y > settings.yMax;
}


/**
  @function refitNewHeadToCanvas(element) -> void
  @desc Pas de x of y coordinaat van het nieuwe hoofd aan
        zodat deze weer binnen het canvas valt
  @param {Element} element een Element object
*/
function refitNewHeadToCanvas(element) {
    switch (snake.getDirection()) {
        case settings.UP:
            element.y = settings.yMax;
            break;
        case settings.DOWN:
            element.y = settings.YMIN;
            break;
        case settings.LEFT:
            element.x = settings.xMax;
            break;
        case settings.RIGHT:
            element.x = settings.XMIN;
            break;
    }
}
/**
  @function updateSnakeCoordinaten(newHead, foodCollision) -> void
  @desc Past coordinaten van de slang en reageer indien deze
        met voedsel botst
  @param {Element} newHead de nieuwe head van de slang
  @param {boolean} foodCollision false bij botsing nieuwe head met voedsel
                                 anders true
*/
function updateSnakeCoordinaten(newHead, foodCollision) {
    snake.segments.at(-1).color = settings.SNAKE;
    snake.segments.push(newHead);
    if(!foodCollision) {
        snake.segments.shift();
    } else {
        removeFood(newHead.x, newHead.y);
		//Aanvulling Laurens
		changeScore();
    }
}


/**
  @function removeFood(x, y) -> void
  @desc Verwijder voedsel indien deze op een gegeven x en y coordinaat ligt
  @param {number} x x-coordinaat
  @param {number} y y-coordinaat
*/
function removeFood(x, y) {
    //ga alle elementen af in de array foods 
    for(var i = 0; i < foods.length; i++){

        //verwijder voedsel dat op de meegegeven coordinaten staat
        if (foods[i].x == x && foods[i].y == y) { 
            foods.splice(i, 1); 
        } 
    } 
} 



/**
  @function verloren() -> void
  @desc Stop het spel en geef aan de gebruiker aan dat deze verloren is

function verloren() {
    stop();
    drawVerloren();
}

*/ 
 
/***************************************************************************
 **                  MODULE SNAKEGAME                                      **
 ***************************************************************************/





 
/***************************************************************************
 **                  MODULE CONTROLLER                                      **
 ***************************************************************************/
import * as settings from "./settings.js";
import {setMaxCoordinates} from "./settings.js";
import {initSnakeGame,stopSnakeGame, move, getSnakeSegments, getFoods, getGameStatus} from "./snakeGame.js";
import {place} from "./snakeGame.js";    
	
//Aanvullling Laurens	
import {resetScore} from "./score.js";	
import {resetNameWinner} from "./winnaar.js";


import {enterWinnerNameTimer} from "./controllerDeux.js";	
import {resetScoreField} from "./controllerDeux.js";	
import {removeNameInputFields} from "./controllerDeux.js";	
import {gewonnen} from "./controllerDeux.js";	
import {initEntriesScoreBoard} from "./controllerDeux.js";	


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
    stopSnakeGame(); 
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
	move(lastPressedArrowKey);
	draw();
	determineResult();
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
    source: 'sad_snake.jpg',
    x: 210, y: 240,
    scale : 0.5
    });
}


function drawGewonnen() {
	$("#mySnakeCanvas").drawImage({
	source: 'newHighScore.jpg',
	x: 230, y: 190,
	scale : 1
	});
}




/***************************************************************************
 **                   MODULE CONTROLLER                                       **
 ***************************************************************************/




/***************************************************************************
 **                 MODULE CONTROLLERDEUX                                          **
 ***************************************************************************/
import * as settings from "./settings.js";

import * as winnaar from "./winnaar.js";
import * as score from "./score.js";

import {setGameStatus}  from "./snakeGame.js";

import {addScoreBoardEntries}  from "./EntriesScoreboard.js";
import {getEntriesScoreBoard}  from "./EntriesScoreboard.js";
import {adjustEntriesScoreboard}  from "./EntriesScoreboard.js";


//import {scoreIsNewHigh}  from "./EntriesScoreboard.js";

import {getEntriesLocalStorage}  from "./LocalStorage.js";
import {addEntriesToLocalStorage}  from "./LocalStorage.js";



export var enterWinnerNameTimer;

//export var place;


/**
  @function setScoreField() -> void
  @desc vul het veld score met de score in het spel
*/
export function setScoreField() {
	let scored = score.getScore();
	$(".scorefield4").text(scored);
} 

/**
  @function getScoreField() -> void
  @desc vul het veld score met de score in het spel
*/
function getScoreField() { 
	return $(".scorefield4").text();
}


/**
  @function resetScoreField() -> void
  @desc zet de waarde van het scoreveld naar 0
*/
export function resetScoreField() { 
	$(".scorefield4").text(0);
}


/**
  @function determineResultGame() -> void
  @desc bepaal of de eindscore een high score is en de winnaar dus heeft gewonnen

function determineResultGame() { 
	//let result = getScore();
	place = scoreIsNewHigh();
	if(!place.includes("noHighscore")) { 
		setGameStatus(settings.WON); 
	} else {setGameStatus(settings.LOST);}
 } 
*/


export function gewonnen(place) {
	createNameInputFields();
	enterWinnerNameTimer = setInterval(function() {
    procesScoreOfWinner(place);}, settings.WAITFORNAMEWINNER);
}



/**
  @function  assignScoreBoardToFields() -> void()
  @desc zet de entries van het scorebord in het scorebord van de applicatie. 
*/	
function assignScoreBoardToFields() { 
	let entries = getEntriesScoreBoard();
	console.log(entries);
	entries.forEach((entryScore, key) => { ; 
		switch (key) {
		case "placeOne": 
		$(".namefield1").text(entryScore.name);
		$(".scorefield1").text(entryScore.score);
		break;
		case "placeTwo": 
		$(".namefield2").text(entryScore.name);
		$(".scorefield2").text(entryScore.score);
		break;
		case "placeThree": 
		$(".namefield3").text(entryScore.name);
		$(".scorefield3").text(entryScore.score);
		break;
		} 
	}); 
} 



/**
  @function  createNameInputFields() -> void()
  @desc creeer het inputveld, de button en de eventlisteren zodat
  de winnaar de naam kan invoeren. 
*/
function createNameInputFields() { 
		createWhiteSpaces();
		createEnterNameButton();
		createEnterNameField();
		createEventlisterer();
} 


/**
  @function  createWhiteSpaces() -> void()
  @desc creeer een witte ruimte 
*/
function createWhiteSpaces() { 
	let labe1One = document.createElement("label");
	let labe1Two = document.createElement("label");
	$(".scoreboard").append(labe1One);
	$(".scoreboard").append(labe1Two);
} 


/**
  @function  createEnterNameButton() -> void()
  @desc creeer button zodat de winnaar zijn/haar naam kan valideren
*/
function createEnterNameButton() { 
	let button = document.createElement("button");
	button.innerHTML = "Enter name";
	$(".scoreboard").append(button);	
	
} 

/**
  @function  createEnterNameField() -> void()
  @desc creeer input veld zodat de winnaar zijn/haar naam kan invoeren
*/
function createEnterNameField() { 
	let nameField = document.createElement("INPUT");
	nameField.setAttribute("type", "text");
	$(".scoreboard").append(nameField);
} 


/**
  @function  createEventlisterer() -> void()
  @desc eventlistener geeft de naam in het inputveld waar de winnaar zijn/haar naam
  heeft ingevuld
*/
function createEventlisterer() { 
	let buttonCollection = document.getElementsByTagName("button");
	let nameFieldCollection = document.getElementsByTagName("INPUT");
	let button = buttonCollection[0];
	let nameField = nameFieldCollection[2]
	buttonCollection[0].addEventListener("click", function() {
		let nameWinner = nameFieldCollection[2].value.substring(0, 13);
		winnaar.setNameWinner(nameWinner);
	});
} 

/**
  @function procesScoreOfWinner() -> void()
  @desc eventlistener geeft de naam in het inputveld waar de winnaar zijn/haar naam
  heeft ingevuld
*/
function procesScoreOfWinner(newplace) { 
	let newPlace = newplace;
	let scored = score.getScore();
	let nameWinner = winnaar.getNameWinner();
	if (nameWinner !== undefined) { 
		changeScoreboard(newPlace, nameWinner, scored);
		addEntriesScoreboardToLocalStorage();
		removeNameInputFields();
		clearInterval(enterWinnerNameTimer);
	} 	
} 


/**
  @function  changeScoreboard(newPlace, name) -> void()
  @desc pas de entries van het scorebord aan in het domein en pas
  pas de waarden in het scorebord aan in de applicatie, indien er een nieuwe 
  high score is. 
 */
function changeScoreboard(newplace, name, score) {
	let newPlace = newplace;
	let nameWinner = name;
	let scored = score;
	console.log("result: " + newPlace + nameWinner + scored);
	adjustEntriesScoreboard(newPlace, nameWinner, scored);
	assignScoreBoardToFields();
}


/**
  @function  removeNameInputFields() -> void()
  @desc creeer het inputveld, de button en de eventlisteren zodat
  de winnaar de naam kan invoeren. 
*/
export function removeNameInputFields() { 
	let labelCollection = document.getElementsByTagName("label");
	let labe1One = labelCollection[10];
	let labe1Two = labelCollection[11];
	if(labe1One !== undefined && labe1Two !== undefined ) { 
		labe1One.remove();
		labe1Two.remove();
	} 
	let buttonCollection = document.getElementsByTagName("button");
	let button = buttonCollection[0];
	if(button !== undefined) { 
		button.remove();
	} 
	let nameFieldCollection = document.getElementsByTagName("INPUT");
	let nameField = nameFieldCollection[2];
	if(nameField !== undefined) { 
		nameField.remove();
	} 
} 


/**
  @function  setEntriesScoreBoard() -> void()
  @desc voeg in de local storage aanwezige entries (met plek, score en naam winnaar)toe aan het scorebord 
  en aan de applicatie
*/
export function initEntriesScoreBoard() { 
	let entriesForScoreboard = getEntriesLocalStorage();
	addScoreBoardEntries(entriesForScoreboard); 
	assignScoreBoardToFields();
} 

/**
  @function  addEntriesToLocalStorage() -> void()
  @desc voeg in de entries van het scorebord in de local storage van de browser 
 */
function addEntriesScoreboardToLocalStorage() { 
	let entriesScoreboard = getEntriesScoreBoard();
	addEntriesToLocalStorage(entriesScoreboard);
} 


/***************************************************************************
 **                 MODULE CONTROLLERDEUX                                    **
 ***************************************************************************/




/***************************************************************************
 **                MODULE LOCALSTORAGE                                **
 ***************************************************************************/


//localStorage.clear();

/**
entry1 = JSON.stringify(new EntryScore("SnakeKiller030", 40, true));
entry2 = JSON.stringify(new EntryScore("Joop", 60, true));
entry3 = JSON.stringify(new EntryScore("Aagje", 200, true));
entry3 = JSON.stringify(new EntryScore("Aagj", 30, true));
localStorage.setItem("placeOne",entry2);
localStorage.setItem("placeTwo",entry1);
//localStorage.setItem("placeThree",entry3);
localStorage.setItem("hey",entry3);
localStorage.setItem("gek",entry3);
*/



/**
  @function setScoreBoard() -> void
  @desc haal de aanwezig entries met naam en score uit de local storage van de webbrowser
 */
export function getEntriesLocalStorage(){ 
	let keysLocalStorage = getKeysLocalStorage();
	let filteredKeysLocalStorage = filterKeysLocalStorage(keysLocalStorage);
	let localEntries = entriesLocalStorage(filteredKeysLocalStorage);
	return localEntries;
} 


/**
  @function getKeysLocalStorage() -> string[]
  @desc lees de keys van de local storage van de webbrows in.
  @return {string[]} keysLocalStorage een array met de keys van de local storage
  */
function getKeysLocalStorage() { 
	let keysLocalStorage = []; 
	let index = localStorage.length - 1;
	while(index >= 0) { 
		let keyName = localStorage.key(index);
		keysLocalStorage.push(keyName);
		index--;
	} 
	return keysLocalStorage;
} 


/**
  @function filterKeysLocalStorage(keys)-> string[]
  @desc filter de keys van de local storage op entries: placeThree, placeTwo, placeOne.
  @param {sring[]} keysLocalStorage een array met keys uit de local storage van de webbrowser
  @return {sring[]} filteredKeysLocalStorage een array met keys (mits aanwezig in local storage): placeThree, placeTwo, placeOne 
  */
function filterKeysLocalStorage(keys) { 
	let filteredKeysLocalStorage = []; 
	if(keys.length <= 0) { 
		return keys
	} 
	keys.forEach(key => {
			if(key.includes("placeOne") || key.includes("placeTwo") || key.includes("placeThree")) { 
				filteredKeysLocalStorage.push(key);
			}});
	return filteredKeysLocalStorage;
} 
	

/**
  @function getEntriesLocalStorage(filteredKeys) -> void
  @desc haal de entries, met naam en score, uit de local storage van de webbrowser 
  en vul met de waarden de variabele entriesScoreboard. De entries uit de local storage worden omgezet
  in een object EntryScore.
  @param {sring[]} filteredKeysLocalStorage een array met keys (mits aanwezig in local storage): placeThree, placeTwo, placeOne 
  */
function entriesLocalStorage(filteredKeys) { 
	let entries = new Map();
	filteredKeys.forEach(key => { 
		let entryScore = JSON.parse(localStorage.getItem(key));
		if (entryScore === null) {  
			entryScore = new EntryScore();
		}
		entries.set(key, entryScore);
	}); 
	return entries;
}	
	


/**
  @function addEntriesToLocalStorage() -> void
  @desc voeg de key/value paren van de map entriesScoreboard toe aan de local storage van de webbrowser,
  de EntrieScore object worden omgezet naar een string format. 
  */
export function addEntriesToLocalStorage(scoreboard) {
	let entries = scoreboard
	entries.forEach((entry, key) => { 
		localStorage.setItem(key, JSON.stringify(entry));
	});
} 



/***************************************************************************
 **                MODULE LOCALSTORAGE                                **
 ***************************************************************************/

