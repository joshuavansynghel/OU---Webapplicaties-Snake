import {Element} from "./element.js";
import {createStartSnake, createHead} from "./snake.js";
import {createFoods} from "./food.js";
import * as settings from "./settings.js";

var snake,
    foods = [],                        // voedsel voor de slang
    snaketimer,                        // timer van de snake
    gameStatus = settings.INACTIVE;     // status van het spel

 export function getSnakeSegments() {
 	return snake.segments;
 }

 export function getFoods() {
 	return foods;
 }

 export function getGameStatus() {
    return gameStatus;
 } 

/**
  @function stopGame() -> void
  @desc Maak het canvas leeg, stop de timer, maak de array met voedsel leeg,
        maak status gameGestart false en maak lastPressedKey terug naar boven
*/
export function stopSnakeGame() { 
  
  /**
  //Aanvulling Laurens 
   clearInterval(enterWinnerNameTimer);
   resetScore();
   removeEnterNameFields();
   //Aanvulling Laurens
   **/
  
  foods = [];
  gameStatus = settings.INACTIVE
  //lastPressedArrowKey = settings.UP;
}

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, 
        cre\"eer een slang, genereer voedsel en teken deze elementen
        en start de timer die de slang doet bewegen
*/
export function initSnakeGame() {
    if(gameStatus = settings.INACTIVE) { 
        gameStatus = settings.ACTIVE;
        
        /**
		//Aanvulling Laurens
		fillScoreField();
		removeEnterNameFields();
		clearInterval(enterWinnerNameTimer);
		resetNameWinner();
		getContentLocalStorage();
		//Aanvulling Laurens
        */
		
		snake = createStartSnake();
        console.log("snake Init: " + snake);
        foods = createFoods(snake);
    }
}

/**
  @function move() -> void
  @desc Beweeg slang in de richting die het laatst met de pijljes werd gedrukt, corrigeer
        indien deze uit het canvas zou verdwijnen en verlies het spel indien slang botst
        met zichzelf
*/
export function move(lastPressedArrowKey) {
    //bepaal de richting van de volgende kop van de slang 
    determineDirection(lastPressedArrowKey);
    let newHead = createNewHead();

    //herbereken positie nieuwe head indien deze buiten het tekenveld zou vallen
    if (elementOutOfBounds(newHead)) {
        refitNewHeadToCanvas(newHead);
    }
	
	//aanvulling Laurens 
	let foodCollision = false; 
	let noFoodsLeft = foods.length <= 1;
	
	
    //behandel mogelijke collisions van slang en voedsel
	if (!newHead.collidesWithOneOf(snake.segments)) {
    	foodCollision = newHead.collidesWithOneOf(foods);
    	updateSnakeCoordinaten(newHead, foodCollision);
	} else {
        gameStatus = settings.LOST;
        determineResultGame();
    }
	if (foodCollision && noFoodsLeft) { 
        gameStatus = settings.WON;
	    determineResultGame(); 
	}  
}



/**
  @function determineDirection() -> void
  @desc Wijzig de richting van de slang indien deze niet tegenovergesteld is met 
        de laatste drukte arrow key
*/
function determineDirection(lastPressedArrowKey) {
    if (!oppositeDirectionSnake(lastPressedArrowKey)) { 
        snake.setDirection(lastPressedArrowKey);
    }
} 

/**
  @function createNewHead() -> Element
  @desc Bereken de positie van het nieuwe hoofd van de slang indien deze binnen
        of buiten het canvas valt
  @return {Element} met straal R en color HEAD
*/
export function createNewHead() {
    let currentHead = snake.segments.at(-1);
    let newHead;

    //maak een nieuwe head aan op basis van laatst ingedrukte arrow key
    switch (snake.getDirection()) {
        case settings.UP:
            newHead = createHead(currentHead.x, currentHead.y - (2 * settings.R));
            break;
        case settings.DOWN:
            newHead = createHead(currentHead.x, currentHead.y + (2 * settings.R));
            break;
        case settings.LEFT:
            newHead = createHead(currentHead.x - (2 * settings.R), currentHead.y);
            break;
        case settings.RIGHT:
            newHead = createHead(currentHead.x + (2 * settings.R), currentHead.y);
            break;
    }
    return newHead;
}

/**
  @function oppositeDirectionSnake() -> boolean
  @desc Geef aan of de huidige richting van de slang tegenovergesteld is
        aan de laatste ingedrukte arrow key
  @return {boolean} false indien de huidige richting van slang en laatst gedrukte
                          arrowkey tegenovergesteld zijn
                    anders true
*/
function oppositeDirectionSnake(lastPressedArrowKey) {
    return (snake.getDirection() == settings.UP && lastPressedArrowKey == settings.DOWN) ||
            (snake.getDirection() == settings.DOWN && lastPressedArrowKey == settings.UP) ||
            (snake.getDirection() == settings.LEFT && lastPressedArrowKey == settings.RIGHT) ||
            (snake.getDirection() == settings.RIGHT && lastPressedArrowKey == settings.LEFT);
}

/**
  @function elementOutOfBounds(element) -> boolean
  @desc Geef aan of het element buiten het canvas valt
  @param {Element} element een Element object
  @return {boolean} false bij:
                       - element van buiten het canvas
                    anders true
*/
function elementOutOfBounds(element) {
    return element.x < settings.XMIN || element.x > settings.xMax ||
            element.y < settings.YMIN || element.y > settings.yMax;
}


/**
  @function refitNewHeadToCanvas(element) -> void
  @desc Pas de x of y coordinaat van het nieuwe hoofd aan
        zodat deze weer binnen het canvas valt
  @param {Element} element een Element object
*/
function refitNewHeadToCanvas(element) {
    switch (snake.getDirection()) {
        case settings.UP:
            element.y = settings.yMax;
            break;
        case settings.DOWN:
            element.y = settings.YMIN;
            break;
        case settings.LEFT:
            element.x = settings.xMax;
            break;
        case settings.RIGHT:
            element.x = settings.XMIN;
            break;
    }
}
/**
  @function updateSnakeCoordinaten(newHead, foodCollision) -> void
  @desc Past coordinaten van de slang en reageer indien deze
        met voedsel botst
  @param {Element} newHead de nieuwe head van de slang
  @param {boolean} foodCollision false bij botsing nieuwe head met voedsel
                                 anders true
*/
function updateSnakeCoordinaten(newHead, foodCollision) {
    snake.segments.at(-1).color = settings.SNAKE;
    snake.segments.push(newHead);
    if(!foodCollision) {
        snake.segments.shift();
    } else {
        removeFood(newHead.x, newHead.y);
		//Aanvulling Laurens
		setScore();
    }
}


/**
  @function removeFood(x, y) -> void
  @desc Verwijder voedsel indien deze op een gegeven x en y coordinaat ligt
  @param {number} x x-coordinaat
  @param {number} y y-coordinaat
*/
function removeFood(x, y) {
    //ga alle elementen af in de array foods 
    for(var i = 0; i < foods.length; i++){

        //verwijder voedsel dat op de meegegeven coordinaten staat
        if (foods[i].x == x && foods[i].y == y) { 
            foods.splice(i, 1); 
        } 
    } 
} 

/**
  @function verloren() -> void
  @desc Stop het spel en geef aan de gebruiker aan dat deze verloren is
*/
function verloren() {
    stopGame();
    drawVerloren();
}
