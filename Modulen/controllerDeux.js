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