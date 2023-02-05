/** @module food */

import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @function createFoods
  @desc   Creëert een array van foodelementen die niet botst met bestaande slang
  @param  {Object} snake - De slang van het spel
  @return {array} foods - Een array van foodelementen
*/
export function createFoods(snake) {   
  var  i = 0,    
       food,
       foods = [];
  while (i < settings.NUMFOODS ) {
    food = createFood(settings.XMIN + getRandomMultipleOfRadius(0, settings.xMax), 
                      settings.YMIN + getRandomMultipleOfRadius(0, settings.yMax));
    if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
      foods.push(food);
      i++
    }
  }
  return foods;  
}

/**
  @function createFood
  @desc    Creëert een food element met gegeven coördinaten
  @param   {number} x - Het x-coordinaat middelpunt
  @param   {number} y - Het y-coordinaart middelpunt
  @return: {Element} Element met straal R en color FOOD
*/
function createFood(x, y) {
  return new Element(settings.R, x, y, settings.FOOD);
}

/**
  @function getRandomMultipeOfRadius
  @desc   Creëren van random veelvoud van het dubbele van de radius in het interval [min, max]
  @param  {number} min - Een geheel getal als onderste grenswaarde
  @param  {number} max - Een geheel getal als bovenste grenswaarde (max > min)
  @return {number} Random geheel getal x waarvoor geldt: 
                                   - min <= x <= max 
                                   - (x % (2*R)) = 0
*/
function getRandomMultipleOfRadius(min, max) {
  let res;

  //genereer willekeurig getal dat deelbaar is door 2*R
  //dit zorgt ervoor dat x en y zo gekozen worden dat ze mooi op canvas worden afgebeeld
  res = getRandomInt(min, Math.floor(max / (2 * settings.R))) * 2 * settings.R;
  return res;
}

/**
  @function getRandomInt
  @desc   Creëren van random geheel getal in het interval [min, max] 
  @param  {number} min - Een geheel getal als onderste grenswaarde
  @param  {number} max - Een geheel getal als bovenste grenswaarde (max > min)
  @return {number} Random geheel getal x waarvoor geldt: min <= x <= max
  @throws {Error} Het moeten gehele getallen van 0 of groter zijn
  @throws {Error} Het eerste argument moet kleiner of gelijk aan het tweede argument zijn
*/
function getRandomInt(min, max) {
  let res;
  
  //voorwaarde dat beide argumenten een positief geheel getal zijn en min <= max  
  if (isPosInteger(min) && isPosInteger(max) && min <= max) {
    res = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  else if(!(isPosInteger(min) && isPosInteger(max))) {
    throw Error("Het moeten gehele getallen van 0 of groter zijn");
  }
  else {
    throw Error("Het eerste argument moet kleiner of gelijk aan het tweede argument zijn")
  }
  return res;
}

/**
  @function isPosInteger
  @desc   Bepalen of het gaat om een positief geheel getal
  @param  {number} een getal
  @return {boolean} false bij:
                       - geen getal
                       - kleiner dan 0;
                    anders true
*/
function isPosInteger(x) {
  return x >= 0 && Number.isInteger(x);
}