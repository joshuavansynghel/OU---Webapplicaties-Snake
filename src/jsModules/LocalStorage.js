/** @module localStorage */

/**
  @function setScoreBoard
  @desc   Haal de keys op uit de local storage, filter enkel de keys die het spel gebruikt en
          haal hun overeenkomstige values op. Ken deze toe aan een Map object en vul indien nodig
          lege plaatsen op
  @return {map} Een map met de entries van de local storage van de browser
 */
export function getEntriesLocalStorage(){ 
	let keysLocalStorage = getKeysLocalStorage();
	let filteredKeysLocalStorage = filterKeysLocalStorage(keysLocalStorage);
	let localEntries = entriesLocalStorage(filteredKeysLocalStorage);
	return localEntries;
} 


/**
  @function getKeysLocalStorage
  @desc   Lees de keys van de local storage van de webbrowser in
  @return {array} Een array met de keys van de local storage
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
  @function filterKeysLocalStorage
  @desc   Filter de keys van de local storage op entries: placeThree, placeTwo, placeOne
  @param  {array} keysLocalStorage - Een array met keys uit de local storage van de webbrowser
  @return {array} Een array met keys (mits aanwezig in local storage): placeThree, placeTwo, placeOne 
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
  @function getEntriesLocalStorage
  @desc   Haal de entries, met naam en score, uit de local storage van de webbrowser 
          en vul met de waarden de variabele entriesScoreboard. De entries uit de local storage worden omgezet
          in een object EntryScore
  @param  {array} filteredKeysLocalStorage - Een array met keys (mits aanwezig in local storage): placeThree, placeTwo, placeOne
  @return {map} Een Map object met alle entries die bij de keys horen
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
  @function addEntriesToLocalStorage
  @desc  Voeg de key/value paren van de map entriesScoreboard toe aan de local storage van de webbrowser,
         het entryScore object worden omgezet naar een string format. 
  @param {map} Een map die alle informatie van de 3 scorebord omvat
  */
export function addEntriesToLocalStorage(scoreboard) {
	let entries = scoreboard
	entries.forEach((entry, key) => { 
		localStorage.setItem(key, JSON.stringify(entry));
	});
} 