/** @module snakeGame */

import * as settings from "./settings.js";
import {Element} from "./element.js";
import {createStartSnake, createHead} from "./snake.js";
import {createFoods} from "./food.js";
import {changeScore, setScore} from "./score.js";
import {scoreIsNewHigh}  from "./EntriesScoreboard.js";

var snake,
    foods = [],                        // voedsel voor de slang
    snaketimer,                        // timer van de snake
    gameStatus = settings.INACTIVE;     // status van het spel

export var place;

/**
  @function getSnakeSegments
  @desc   Geef de segmenten van de slang
  @return {array} Een array van segmenten
*/
export function getSnakeSegments() {
  return snake.segments;
}

/**
  @function getFoods
  @desc   Geef de voedselelementen van het spel
  @return {array} Een array van voedselelementen
*/
export function getFoods() {
  return foods;
}

/**
  @function getGameStatus
  @desc   Geef de status van het spel
  @return {string} gameStatus - De status van het spel
*/
export function getGameStatus() {
  return gameStatus;
} 

/**
  @function setGameStatus
  @desc  Wijzig de status van het spel
  @param {string} gameStatus - De nieuwe status van het spel
*/
export function setGameStatus(status) {
  gameStatus = status;
} 

/**
  @function resetSnakeGame
  @desc Verwijder alle voedselelementen en zet gamestatus op inactief
*/
export function resetSnakeGame() { 
  foods = [];
  gameStatus = settings.INACTIVE
}

/**
  @function initSnakeGame
  @desc Activeer het spel indien dit inactief was en maak
        de slang en het voedsel aan
*/
export function initSnakeGame() {
  if(gameStatus = settings.INACTIVE) { 
    gameStatus = settings.ACTIVE;
    snake = createStartSnake();
    foods = createFoods(snake);
  }
}

/**
  @function moveSnakeAndResolveCollisions
  @desc  Beweeg slang in de richting die het laatst met de pijljes werd gedrukt, corrigeer
         indien deze uit het canvas zou verdwijnen en verwerk alle acties indien
         er een collision optreedt met zichzelf of foodelement
  @param {string} lastPressedArrowKey - De arrowkey die de gebruiker het laatst heeft ingedrukt
*/
export function moveSnakeAndResolveCollisions(lastPressedArrowKey) {
  //bepaal de richting van de volgende kop van de slang en maak nieuw hoofd aan
  determineDirection(lastPressedArrowKey);
  let newHead = createNewHead();

  //herbereken positie nieuw head indien deze buiten het tekenveld zou vallen
  if (elementOutOfBounds(newHead)) {
    refitNewHeadToCanvas(newHead);
  }
  //klaar alle mogelijke collisions uit en update het spel
  resolveCollisionsAndUpdateGame(newHead);
}

/**
  @function resolveCollisionsAndUpdateGame
  @desc  Detecteer alle mogelijke collisions:
           - slang botst niet met zichzelf   -> beweeg slang en eet mogelijk foodelement
           - slang botst met laatste voedsel -> spel gewonnen
           - slang botst met zichzelf        -> spel verloren
  @param {Object} newHead - Het nieuwe hoofd van de slang
*/
function resolveCollisionsAndUpdateGame(newHead) {
  if (!newHead.collidesWithOneOf(snake.segments)) {
    moveSnakeAndEatFood(newHead, newHead.collidesWithOneOf(foods));
  } 
  else if (foods.length = 0) {
    determineResultGame();
  } else {
    determineResultGame();
  }
}

/**
  @function determineResultGame
  @desc Bepaal of eindscore een nieuwe highscore is waarbij de speler wint en
        zoniet verliest de gebruiker het spel
*/
function determineResultGame() { 
  place = scoreIsNewHigh();
  if(!place.includes("noHighscore")) { 
    setGameStatus(settings.WON); 
  } else {setGameStatus(settings.LOST);}
} 

/**
  @function determineDirection
  @desc  Wijzig de richting van de slang indien deze niet tegenovergesteld is met 
         de laatste drukte arrow key
  @param {string} lastPressedArrowKey - De arrowkey die de gebruiker het laatst heeft ingedrukt
*/
function determineDirection(lastPressedArrowKey) {
  if (!oppositeDirectionSnake(lastPressedArrowKey)) { 
    snake.setDirection(lastPressedArrowKey);
  }
} 

/**
  @function createNewHead
  @desc   Creëer een nieuw hoofd voor de slang op basis van de huidige richting
          van de slang
  @return {Element} Element met straal R en color HEAD
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
  @function oppositeDirectionSnake
  @desc   Geef aan of de huidige richting van de slang tegenovergesteld is
          aan de laatste ingedrukte arrow key
  @param  {string} lastPressedArrowKey - De arrowkey die de gebruiker het laatst heeft ingedrukt
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
  @function elementOutOfBounds
  @desc   Geef aan of het element buiten het canvas valt
  @param  {Object} element - Het te toetsen element
  @return {boolean} true bij:
                       - element van buiten het canvas
                    anders false
*/
function elementOutOfBounds(element) {
  return element.x < settings.XMIN || element.x > settings.xMax ||
         element.y < settings.YMIN || element.y > settings.yMax;
}

/**
  @function refitNewHeadToCanvas
  @desc Pas de x of y coordinaat van het nieuwe hoofd aan
        zodat deze weer binnen het canvas valt
  @param {Element} element - Het te wijzigen element
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
  @function moveSnakeAndEatFood
  @desc  Past coordinaten van de slang en reageer indien deze
         met voedsel botst
  @param {Element} newHead - Het nieuwe hoofd van de slang
  @param {boolean} foodCollision false bij botsing nieuwe head met voedsel
                                 anders true
*/
function moveSnakeAndEatFood(newHead, foodCollision) {
  snake.segments.at(-1).color = settings.SNAKE;
  snake.segments.push(newHead);

  //indien geen botsing met voedsel wordt laatste element van de staart verwijderd
  if(!foodCollision) {
    snake.segments.shift();

    //indien botsing voedsel wordt voedsel verwijderd en score aangepast
  } else {
    removeFood(newHead.x, newHead.y);
    changeScore();
  }
}

/**
  @function removeFood
  @desc  Verwijder voedsel op een gegeven x en y coordinaat
  @param {number} x - Het x-coordinaat
  @param {number} y - Het y-coordinaat
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