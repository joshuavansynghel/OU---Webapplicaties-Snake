
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
