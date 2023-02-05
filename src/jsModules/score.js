var score = 0; 


/**
  @function  setScore(newScore) -> void
  @desc pas de score aan 
  @param {string} newScore de nieuwe waarde van de score
  */	
export function setScore(newScore){
	score = newScore;
} 


/**
  @function getScore() -> string
  @desc geeft de huidige score van het spel
  @return {string} score de huidige score van het spel
  */	
export function getScore() { 
	return score; 
}


/**
  @function changeScore() -> void
  @desc veranderd de score met 10 punten
  */	
export function changeScore() { 
	score = score + 10;
} 


/**
  @function resetScore() -> void
  @desc reset de score van het spel naar 0
  */		
export function resetScore() { 
	score = 0;
} 

