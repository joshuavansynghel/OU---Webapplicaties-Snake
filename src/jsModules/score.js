/** @module score */

var score = 0;          // de huidige score van het spel


/**
  @function setScore
  @desc Pas de score aan naar een gegeven waarde
  @param {string} newScore - De nieuwe waarde van de score
  */	
export function setScore(newScore){
	score = newScore;
} 


/**
  @function getScore
  @desc Geef de huidige score van het spel
  @return {string} De huidige score van het spel
  */	
export function getScore() { 
	return score; 
}


/**
  @function changeScore
  @desc Incrementeer de score met 10
  */	
export function changeScore() { 
	score = score + 10;
} 


/**
  @function resetScore
  @desc Reset de score van het spel naar 0
  */		
export function resetScore() { 
	score = 0;
} 