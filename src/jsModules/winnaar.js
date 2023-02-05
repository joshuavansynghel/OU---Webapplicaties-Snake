
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
