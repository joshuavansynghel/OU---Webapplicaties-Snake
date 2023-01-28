import * as settings from "./settings.js";
import {initSnakeGame,stopSnakeGame} from "./snakeGame.js";
    
var width,                             // breedte van het tekenveld
    height,                            // hoogte van het tekenveld

    xMax,                              // maximale waarde van x
    yMax,                              // maximale waarde van y

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
    $("#stopSnake").click(stopSnakeGame);
    $("#startSnake").click(startSnakeGame);
});


function stopSnakeGame() {
    $("#mySnakeCanvas").clearCanvas();
    clearInterval(snaketimer); 
}

function startSnakeGame() {
    initSnakeGame();
    draw();
    snaketimer = setInterval(function() {
        move(lastPressedArrowKey);}, settings.SLEEPTIME); 
}

/**
  @function prepareCanvas() -> void
  @desc Haal de afmetingen van het canvas op en indien nodig pas deze aan
        om de elementen mooi af te beelden, sla het max en min van de coordinaten op
*/
function prepareCanvas() {
    getDimensionsCanvas();

    //toekennen van max waarde die x of y kan hebben
    xMax = width - settings.R;     
    yMax = height - settings.R;    
}

/**
  @function getDimensionsCanvas() -> void
  @desc Haal de hoogte en wijdte van het canvas op via het DOM-object
        en sla deze op in variabelen
*/
function getDimensionsCanvas() {
    width = $("#mySnakeCanvas").innerWidth();
    height = $("#mySnakeCanvas").innerHeight();
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


////////////////Aanvulling Laurens 

var place;

function gewonnen(place) {
	stopGame();
	drawGewonnen();
	enterNameFields();
	
	enterWinnerNameTimer = setInterval(function() {
    checkIfNameWinnerIsPresent();}, settings.WAITFORNAMEWINNER);
}

function drawGewonnen() {
	$("#mySnakeCanvas").drawImage({
	source: 'newHighScore.jpg',
	x: 230, y: 190,
	scale : 1
	});
}




/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/



/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/
 








/***************************************************************************
 **                 Score                                         **
 ***************************************************************************/
 
var score = 0; 
var nameWinner;

var entriesLocalStorage;

 

function getNameWinner() { 
	return nameWinner; 
} 

function resetNameWinner() { 
	nameWinner = undefined;
} 


function setScore(){
	changeScore();
	fillScoreField();
} 
	
function changeScore() { 
	score = score + 10;
} 
	
function resetScore() { 
	score = 0;
	
} 

function getScore() { 
	return score; //$(".scorefield4").text();
	
} 

function scoreIsNewHigh(score) { 
	let newPlace = "noHighscore"; 
	let intermediateScore = 0; 
	entriesLocalStorage.forEach((entry, key) => { 
		let entryScore = entry.score; 
		console.log(score >= entryScore && entryScore >=  intermediateScore);
		if (+score >= +entryScore && +entryScore >=  +intermediateScore){ 
			intermediateScore = entryScore;
			newPlace = key;	
		}
	}); 
	return newPlace;
} 

function adjustEntriesLocalStorage(place, newName) { 
		let newScore = getScoreField();
		let newEntry = new EntryScore(newName, newScore); 
		//console.log(place);
		switch (place) {
    		case "placeOne": 
    		entryPlaceOne = entriesLocalStorage.get("placeOne");
    		entryPlaceTwo = entriesLocalStorage.get("placeTwo");
    		entriesLocalStorage.set("placeOne", newEntry);
    		entriesLocalStorage.set("placeTwo",entryPlaceOne);
    		entriesLocalStorage.set("placeThree",entryPlaceTwo);
		  break;
		case "placeTwo": 
    		entryPlaceTwo = entriesLocalStorage.get("placeTwo");
    		entriesLocalStorage.set("placeTwo",newEntry);
    		entriesLocalStorage.set("placeThree",entryPlaceTwo);
    		break;
		case "placeThree": 
		    entriesLocalStorage.set("placeThree",newEntry);
		    break;
		} 
} 





/***************************************************************************
 **                 LocalStorage                                    **
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

var entriesLocalStorage;
	

function EntryScore(name, scored) { 
	this.name = name;
	this.score = scored;

} 

function getContentLocalStorage(){ 
	initEntriesLocalStorage();
	let keysLocalStorage = getKeysLocalStorage();
	let filteredKeysLocalStorage = filterKeysLocalStorage(keysLocalStorage);
	let entriesLocalStorage = getEntriesLocalStorage(filteredKeysLocalStorage);
	completeEntriesLocalStorage();
	assignStorageToScorefields(entriesLocalStorage);
	addEntriesToLocalStorage();
} 


function initEntriesLocalStorage() { 
	entriesLocalStorage = new Map();
	entriesLocalStorage.set("placeThree", );
	entriesLocalStorage.set("placeTwo", );
	entriesLocalStorage.set("placeOne", );
} 

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
	

function getEntriesLocalStorage(filteredKeys) { 
	filteredKeys.forEach(key => { 
		let entryScore = JSON.parse(localStorage.getItem(key));
		if (entryScore === null) {  
			entryScore = new EntryScore();
		}
		entriesLocalStorage.set(key, entryScore);
	}); 
	return  entriesLocalStorage;
}	
	
	
function completeEntriesLocalStorage() { 
	let places = ["placeOne", "placeTwo", "placeThree"];
	places.forEach(key => { 
		if(entriesLocalStorage.get(key) === undefined) { 
			entriesLocalStorage.set(key, new EntryScore("", 0));
		} 
	});	
} 


function addEntriesToLocalStorage() {
	entriesLocalStorage.forEach((entry, key) => { 
		localStorage.setItem(key, JSON.stringify(entry));
	});
} 



/***************************************************************************
 **                 Application                                          **
 ***************************************************************************/

var enterWinnerNameTimer;



function fillScoreField() {
	$(".scorefield4").text(score);
} 



function getScoreField() { 
	return $(".scorefield4").text();
}



function changeScoreWithinGame(newPlace, name) {
	let place = newPlace;
	if(!place.includes("noHighscore")) {
		adjustEntriesLocalStorage(place, name);
		addEntriesToLocalStorage();
		assignStorageToScorefields(entriesLocalStorage);
	} 
}
	

	
function assignStorageToScorefields(sortedEntries) { 
	entriesLocalStorage.forEach((entryScore, key) => { ; 
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

function determineResultGame() { 
	let result = getScoreField();
	let place = scoreIsNewHigh(result);
	if(!place.includes("noHighscore")) { 
		gewonnen(place); 
	} else {verloren();}
 } 


function enterNameFields() { 
	createEnterNameButton();
	createEnterNameField();
	createEventlisterer();
} 



function createEnterNameButton() { 
	let labe1One = document.createElement("label");
	let labe1Two = document.createElement("label");
	$(".scoreboard").append(labe1One);
	$(".scoreboard").append(labe1Two);
	var button = document.createElement("button");
	button.innerHTML = "Enter name";
	$(".scoreboard").append(button);	
	
} 

function createEnterNameField() { 
	var nameField = document.createElement("INPUT");
	nameField.setAttribute("type", "text");
	$(".scoreboard").append(nameField);
} 

function createEventlisterer() { 
	let buttonCollection = document.getElementsByTagName("button");
	let nameFieldCollection = document.getElementsByTagName("INPUT");
	let button = buttonCollection[0];
	let nameField = nameFieldCollection[2]
	buttonCollection[0].addEventListener("click", function() {
	let nameWinner = nameFieldCollection[2].value.substring(0, 13);
	});
	return nameWinner;
} 



function checkIfNameWinnerIsPresent() { 
	console.log(score);
	var nameWinner = getNameWinner();
	if (nameWinner !== undefined) { 

		changeScoreWithinGame(place, nameWinner);
		removeEnterNameFields();
		clearInterval(enterWinnerNameTimer);
	} 	
} 


function removeEnterNameFields() { 
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
