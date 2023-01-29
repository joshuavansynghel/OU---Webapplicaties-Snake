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