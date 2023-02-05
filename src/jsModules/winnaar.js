/** @module winnaar */

var nameWinner;        // de naam van de winnaar

 
/**
  @function getNameWinner
  @desc   Geef de naam van de winnaar
  @return {string} De naam van de winnaar
  */		
export function getNameWinner() { 
	return nameWinner; 
} 


/**
  @function setNameWinner
  @desc  Verander de naam van de winnaar
  @param {string} name - De naam van de winnaar
  */		
export function setNameWinner(name) { 
	nameWinner = name;
} 

/**
  @function resetNameWinner
  @desc Zet de naam van de winnaar naar undefined
  */	
export function resetNameWinner() { 
	nameWinner = undefined;
} 
