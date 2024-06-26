/** @module scoreboardController */

import * as settings from "./settings.js";
import * as winnaar from "./winnaar.js";
import * as score from "./score.js";

import {getEntriesLocalStorage, addEntriesToLocalStorage}  from "./localStorage.js";
import {addScoreBoardEntries, getEntriesScoreBoard, adjustEntriesScoreboard}  from "./entriesScoreboard.js";


export var enterWinnerNameTimer;           // timer die de input van de naam van de winnaar controleert


/**
  @function setScoreField
  @desc Vul het scoreveld in met de score van het spel
*/
export function setScoreField() {
	let scored = score.getScore();
	$(".scorefield4").text(scored);
} 


/**
  @function getScoreField
  @desc   Haal de huidig afgebeelde score op van het scoreveld
  @return {string} De score ingevuld in het scoreveld
*/
function getScoreField() { 
	return $(".scorefield4").text();
}


/**
  @function resetScoreAndAdjustScoreboard
  @desc Reset de score van het spel, de score op het scoreveld en de 
        naam van de winnaar, verwijder het inputveld uit de viewer en
        initialiseer het scorebord met de nieuwe highscores
*/
export function resetScoreAndAdjustScoreboard() {$
  score.resetScore();
  resetScoreField();
  removeNameInputFields();
  winnaar.resetNameWinner();
  clearInterval(enterWinnerNameTimer);
  initEntriesScoreBoard();
}


/**
  @function resetScoreField
  @desc Zet de waarde van het scoreveld naar 0
*/
function resetScoreField() { 
	$(".scorefield4").text(0);
}


/**
  @function  removeNameInputFields
  @desc Verwijder het label, het inputveld en de knop waar de winnaar
        zijn/haar naam kan invoeren
*/
function removeNameInputFields() { 
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
  @function  setEntriesScoreBoard
  @desc Voeg de in de local storage aanwezige entries (met plek, score en naam winnaar)toe 
        aan het scorebord en aan de applicatie
*/
function initEntriesScoreBoard() { 
	let entriesForScoreboard = getEntriesLocalStorage();
	addScoreBoardEntries(entriesForScoreboard); 
	assignScoreBoardToFields();
}


/**
  @function assignScoreBoardToFields
  @desc Zet de entries van het scorebord in het scorebord van de applicatie. 
*/	
function assignScoreBoardToFields() { 
	let entries = getEntriesScoreBoard();
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
  @function gewonnen
  @desc Maak een inputveld aan waar de winnaar zijn naam kan schrijven en 
        detecteer deze input aan de hand van een timer
  @param {string} place - De plaats van de nieuwe winnaar
*/
export function gewonnen(place) {
	createNameInputFields();
	enterWinnerNameTimer = setInterval(function() {
    procesScoreOfWinner(place);}, settings.WAITFORNAMEWINNER);
}


/**
  @function createNameInputFields
  @desc Creëer het inputveld, de button en de eventlistener zodat
        de winnaar zijn/haar naam kan invoeren. 
*/
function createNameInputFields() { 
		createWhiteSpaces();
		createEnterNameButton();
		createEnterNameField();
		createEventlisterer();
} 


/**
  @function createWhiteSpaces
  @desc Creëer een witte ruimte 
*/
function createWhiteSpaces() { 
	let labe1One = document.createElement("label");
	let labe1Two = document.createElement("label");
	$(".scoreboard").append(labe1One);
	$(".scoreboard").append(labe1Two);
} 


/**
  @function createEnterNameButton
  @desc Creëer button zodat de winnaar zijn/haar naam kan valideren
*/
function createEnterNameButton() { 
	let button = document.createElement("button");
	button.innerHTML = "Enter name";
	$(".scoreboard").append(button);	
} 


/**
  @function createEnterNameField
  @desc Creëer input veld zodat de winnaar zijn/haar naam kan invoeren
*/
function createEnterNameField() { 
	let nameField = document.createElement("INPUT");
	nameField.setAttribute("type", "text");
	$(".scoreboard").append(nameField);
} 


/**
  @function  createEventlisterer
  @desc Eventlistener voor de knop naast het inputveld die de naam van de 
        winnaar opslaat
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
  @function procesScoreOfWinner
  @desc  Bepaal de plaats, score en naam van de winnaar en pas hiermee het 
         scorebord en de entries in de local storage aan. Verwijder het
         inputveld en stop de timer voor de naam in te vullen
  @param {string} newplace - De plaats die de winnaar moet krijgen in het scorebord
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
  @function changeScoreboard
  @desc Pas de entries van het scorebord aan in het domein en pas de waarden 
        in het scorebord aan in de applicatie indien er een nieuwe high score is.
  @param {string} newplace - De plaats die de winnaar moet krijgen in het scorebord
  @param {string} name - De naam van de winnaar
  @param {number} score - De score die de winnaar heeft behaald
 */
function changeScoreboard(newplace, name, score) {
	let newPlace = newplace;
	let nameWinner = name;
	let scored = score;
	adjustEntriesScoreboard(newPlace, nameWinner, scored);
	assignScoreBoardToFields();
}


/**
  @function  addEntriesToLocalStorage
  @desc Voeg de entries van het scorebord toe aan de local storage 
 */
function addEntriesScoreboardToLocalStorage() { 
	let entriesScoreboard = getEntriesScoreBoard();
	addEntriesToLocalStorage(entriesScoreboard);
}  