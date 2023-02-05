/** @module entriesScoreboard */

import {getScore} from "./score.js";


var entriesScoreboard;              // het scorebord met de 3 highscores
	

/**
  @construcor EntryScore
  @desc  Creëer een entry voor het scoreboard
  @param {string} name - De naam van de winnaar
  @param {string} scored - De score van de winnaar 
 */
function EntryScore(name, scored) { 
	this.name = name;
	this.score = scored;
} 


/**
  @function getEntriesScoreBoard
  @desc Geef de huidige entries van het scorebord.
  @return {map} Een map met de entries van het scorebord 
  */
export function getEntriesScoreBoard() { 
	return entriesScoreboard;
}


/**
  @function scoreIsNewHigh
  @desc   Bepaal of de behaalde score een nieuwe high score is (top 3)
  @return {string} Behaalde plaats van de score in het scorebord, 
                   bij geen high score is de returnwaarde "noHighscore"
  */	
export function scoreIsNewHigh() { 
	let newPlace = "noHighscore"; 
	let scored = getScore();
	let intermediateScore = 0; 
	entriesScoreboard.forEach((entry, key) => { 
		let entryScore = entry.score; 
		if (+scored >= +entryScore && +entryScore >=  +intermediateScore){ 
			intermediateScore = entryScore;
			newPlace = key;	
		}
	}); 
	return newPlace;
} 


/**
  @function adjustentriesScoreboard
  @desc  Pas het scorebord aan met een nieuw behaalde high score
  @param {string} newPlace - De nieuwe plaats van de behaalde high score (placeOne, placeTwo, placeThree)
  @param {string} winner - De naam van de winnaar
  @param {number} scored - De score van de winnaar
 */	
export function adjustEntriesScoreboard(newPlace, winner, scored) { 
	let place = newPlace;
	let newScore = scored;
	let nameWinner = winner;
	let newEntry = new EntryScore(nameWinner, newScore); 
	let entryPlaceTwo;
	switch (place) {
		//bij nieuwe plaats 1 worden vorige plaats 1 en 2 doorgeschoven
	  case "placeOne": 
	    let entryPlaceOne = entriesScoreboard.get("placeOne");
	    entryPlaceTwo = entriesScoreboard.get("placeTwo");
	    entriesScoreboard.set("placeOne", newEntry);
	    entriesScoreboard.set("placeTwo",entryPlaceOne);
	    entriesScoreboard.set("placeThree",entryPlaceTwo);
	    break;

	  //bij nieuwe plaats 2 wordt vorige plaats 2 doorgeschoven
	  case "placeTwo": 
	    entryPlaceTwo = entriesScoreboard.get("placeTwo");
	    entriesScoreboard.set("placeTwo",newEntry);
	    entriesScoreboard.set("placeThree",entryPlaceTwo);
	    break;

	  //bij nieuwe plaats 3 wordt vorige plaats 3 vervangen
	  case "placeThree": 
	  entriesScoreboard.set("placeThree",newEntry);
	  break;
	} 
}


/**
  @function addScoreBoardEntries
  @desc  Ken een nieuwe map toe aan de variabele entriesScoreboard voor de highscores, haal de entries
         voor deze highscores uit de local storage, en vul deze aan in deze map. Indien geen highscores bekend
         wordt een lege entry toegevoegd aan de map
  @param {map} entriesLocalStorage - De scoreboard entries uit de local storage van de webbrowser
 */
export function addScoreBoardEntries(entriesLocalStorage){ 
	setKeysScoreboard();
	setEntriesScoreBoard(entriesLocalStorage);
	completeEntriesScoreboard();
} 


/**
  @function setKeysScoreboard
  @desc Initialiseer de variabele met de entries van het scorebord, door toekenning van 
        een Map()object met de vast keys: placeThree, placeTwo, placeOne 
  */
function setKeysScoreboard() { 
	entriesScoreboard = new Map();
	entriesScoreboard.set("placeThree", );
	entriesScoreboard.set("placeTwo", );
	entriesScoreboard.set("placeOne", );
} 


/**
  @function setEntriesScoreBoard
  @desc Vul de map aan met de entries uit de local storage
  @param {map} entriesLocalStorage - De scoreboard entries uit de local storage van de webbrowser
  */
function setEntriesScoreBoard(entriesLocalStorage) { 
	let entries = entriesLocalStorage;
	entries.forEach((entryScore, key) => { 
		entriesScoreboard.set(key, entryScore);
	}); 
}	
	

/**
  @function completeEntriesScoreboard
  @desc Als in de map entriesScoreboard één van de 3 keys geen EntrieScore als waarde heeft, 
        dan krijgt deze key als waarde een EntryScore object zonder naam en met score 0
  */	
function completeEntriesScoreboard() { 
	let places = ["placeOne", "placeTwo", "placeThree"];
	places.forEach(key => { 
		if(entriesScoreboard.get(key) === undefined) { 
			entriesScoreboard.set(key, new EntryScore("", 0));
		} 
	});	
} 